from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import httpx
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Drew's Lab API", description="API for Drew Syverson's Home SOC & IT Lab")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class VMStatus(BaseModel):
    deviceName: str
    powerState: str
    cpuUsage: float
    memoryUsage: float
    diskUsage: float
    lastUpdated: datetime

# Original routes
@api_router.get("/")
async def root():
    return {"message": "Drew's Lab API - Home SOC & IT Lab"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# VM Status routes for lab infrastructure
@api_router.get("/vm-status/{device_name}")
async def get_vm_status(device_name: str):
    """
    Get VM status from Proxmox API
    Supported devices: pfsense, dc01, UbuWebServ, WinWork, Kali
    """
    valid_devices = ['pfsense', 'dc01', 'UbuWebServ', 'WinWork', 'Kali']
    
    if device_name not in valid_devices:
        raise HTTPException(status_code=400, detail=f"Invalid device name. Supported devices: {valid_devices}")
    
    try:
        # Make request to the external Proxmox API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"https://labenv-as.com/internal-api/api/vmstatus/{device_name}",
                headers={
                    "Accept": "application/json",
                    "User-Agent": "DrewsLab-Dashboard/1.0"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Store the status in our database for historical tracking
                vm_status = {
                    "id": str(uuid.uuid4()),
                    "deviceName": device_name,
                    "powerState": data.get("powerState", "unknown"),
                    "cpuUsage": float(data.get("cpuUsage", 0)),
                    "memoryUsage": float(data.get("memoryUsage", 0)),
                    "diskUsage": float(data.get("diskUsage", 0)),
                    "lastUpdated": datetime.utcnow(),
                    "rawData": data
                }
                
                # Store in database (optional - for historical data)
                try:
                    await db.vm_status.insert_one(vm_status)
                except Exception as db_error:
                    logger.warning(f"Failed to store VM status in database: {db_error}")
                
                return {
                    "deviceName": device_name,
                    "powerState": data.get("powerState", "unknown"),
                    "cpuUsage": data.get("cpuUsage", 0),
                    "memoryUsage": data.get("memoryUsage", 0),
                    "diskUsage": data.get("diskUsage", 0),
                    "lastUpdated": datetime.utcnow().isoformat(),
                    "status": "success"
                }
            else:
                logger.error(f"External API returned status {response.status_code} for device {device_name}")
                raise HTTPException(
                    status_code=response.status_code, 
                    detail=f"External API error: {response.status_code}"
                )
                
    except httpx.TimeoutException:
        logger.error(f"Timeout when fetching status for device {device_name}")
        raise HTTPException(status_code=504, detail="Timeout connecting to Proxmox API")
    except httpx.RequestError as e:
        logger.error(f"Request error when fetching status for device {device_name}: {e}")
        raise HTTPException(status_code=502, detail="Failed to connect to Proxmox API")
    except Exception as e:
        logger.error(f"Unexpected error when fetching status for device {device_name}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/vm-status")
async def get_all_vm_status():
    """Get status for all VMs"""
    devices = ['pfsense', 'dc01', 'UbuWebServ', 'WinWork', 'Kali']
    results = {}
    
    async def fetch_device_status(device):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"https://labenv-as.com/internal-api/api/vmstatus/{device}",
                    headers={
                        "Accept": "application/json",
                        "User-Agent": "DrewsLab-Dashboard/1.0"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "deviceName": device,
                        "powerState": data.get("powerState", "unknown"),
                        "cpuUsage": data.get("cpuUsage", 0),
                        "memoryUsage": data.get("memoryUsage", 0),
                        "diskUsage": data.get("diskUsage", 0),
                        "lastUpdated": datetime.utcnow().isoformat(),
                        "status": "success"
                    }
                else:
                    return {
                        "deviceName": device,
                        "status": "error",
                        "error": f"API returned status {response.status_code}"
                    }
        except Exception as e:
            return {
                "deviceName": device,
                "status": "error",
                "error": str(e)
            }
    
    # Fetch all device statuses concurrently
    tasks = [fetch_device_status(device) for device in devices]
    device_results = await asyncio.gather(*tasks)
    
    for result in device_results:
        results[result['deviceName']] = result
    
    return {
        "devices": results,
        "timestamp": datetime.utcnow().isoformat(),
        "total_devices": len(devices)
    }

@api_router.get("/vm-status/history/{device_name}")
async def get_vm_status_history(device_name: str, limit: int = 100):
    """Get historical VM status data"""
    valid_devices = ['pfsense', 'dc01', 'UbuWebServ', 'WinWork', 'Kali']
    
    if device_name not in valid_devices:
        raise HTTPException(status_code=400, detail=f"Invalid device name. Supported devices: {valid_devices}")
    
    try:
        # Get historical data from database
        cursor = db.vm_status.find(
            {"deviceName": device_name}
        ).sort("lastUpdated", -1).limit(limit)
        
        history = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string and format response
        formatted_history = []
        for record in history:
            record['_id'] = str(record['_id'])  # Convert ObjectId to string
            formatted_history.append(record)
        
        return {
            "deviceName": device_name,
            "history": formatted_history,
            "count": len(formatted_history)
        }
        
    except Exception as e:
        logger.error(f"Error fetching history for device {device_name}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch device history")

# Lab info endpoint
@api_router.get("/lab-info")
async def get_lab_info():
    """Get general lab information"""
    return {
        "name": "Drew Syverson's Home SOC & IT Lab",
        "description": "Self-hosted cybersecurity lab with real-world enterprise simulation",
        "features": [
            "Real-time VM monitoring",
            "SIEM integration with Wazuh",
            "Network security with pfSense",
            "Active Directory environment", 
            "Penetration testing capabilities"
        ],
        "devices": {
            "pfsense": {
                "role": "Firewall/Router",
                "function": "Network security and routing",
                "ip": "192.168.0.1"
            },
            "dc01": {
                "role": "Domain Controller", 
                "function": "Active Directory services",
                "ip": "192.168.0.10"
            },
            "UbuWebServ": {
                "role": "Web Server",
                "function": "Web applications and services",
                "ip": "192.168.0.20" 
            },
            "WinWork": {
                "role": "Windows Workstation",
                "function": "Client testing and administration", 
                "ip": "192.168.0.30"
            },
            "Kali": {
                "role": "Security Testing",
                "function": "Penetration testing and assessment",
                "ip": "192.168.0.40"
            }
        },
        "last_updated": datetime.utcnow().isoformat()
    }

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "api_version": "1.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)