import requests
import unittest
import sys
from datetime import datetime

class DrewLabAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                result = {
                    "name": name,
                    "status": "PASS",
                    "response_code": response.status_code
                }
                try:
                    result["data"] = response.json()
                except:
                    result["data"] = "No JSON response"
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                result = {
                    "name": name,
                    "status": "FAIL",
                    "expected_code": expected_status,
                    "response_code": response.status_code
                }
                try:
                    result["error"] = response.json()
                except:
                    result["error"] = response.text

            self.test_results.append(result)
            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "status": "ERROR",
                "error": str(e)
            })
            return False, None

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )

    def test_health_check(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )

    def test_lab_info(self):
        """Test the lab info endpoint"""
        return self.run_test(
            "Lab Info",
            "GET",
            "lab-info",
            200
        )

    def test_vm_status_all(self):
        """Test getting all VM statuses"""
        return self.run_test(
            "All VM Statuses",
            "GET",
            "vm-status",
            200
        )

    def test_vm_status_individual(self, device_name):
        """Test getting status for a specific VM"""
        return self.run_test(
            f"VM Status - {device_name}",
            "GET",
            f"vm-status/{device_name}",
            200
        )

    def test_vm_status_invalid_device(self):
        """Test getting status for an invalid device name"""
        return self.run_test(
            "VM Status - Invalid Device",
            "GET",
            "vm-status/invalid-device",
            400
        )

    def test_vm_status_history(self, device_name):
        """Test getting VM status history"""
        return self.run_test(
            f"VM Status History - {device_name}",
            "GET",
            f"vm-status/history/{device_name}",
            200
        )

    def test_create_status_check(self):
        """Test creating a status check"""
        return self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data={"client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"}
        )

    def test_get_status_checks(self):
        """Test getting status checks"""
        return self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )

    def print_summary(self):
        """Print a summary of test results"""
        print("\n" + "="*50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*50)
        
        if self.tests_passed == self.tests_run:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed.")
            
            # Print failed tests
            for result in self.test_results:
                if result["status"] != "PASS":
                    print(f"\n❌ {result['name']} - {result['status']}")
                    if "error" in result:
                        print(f"   Error: {result['error']}")
                    if "expected_code" in result:
                        print(f"   Expected: {result['expected_code']}, Got: {result['response_code']}")

def main():
    # Get the backend URL from environment variable
    backend_url = "https://db919c9d-536e-40de-bfef-b9877015d7d0.preview.emergentagent.com"
    
    print(f"🔌 Testing API at: {backend_url}")
    
    # Setup tester
    tester = DrewLabAPITester(backend_url)
    
    # Run basic API tests
    tester.test_root_endpoint()
    tester.test_health_check()
    tester.test_lab_info()
    
    # Test VM status endpoints
    tester.test_vm_status_all()
    
    # Test individual VM status for each device
    devices = ['pfsense', 'dc01', 'UbuWebServ', 'WinWork', 'Kali']
    for device in devices:
        tester.test_vm_status_individual(device)
    
    # Test invalid device name
    tester.test_vm_status_invalid_device()
    
    # Test VM status history
    tester.test_vm_status_history('pfsense')
    
    # Test status check endpoints
    tester.test_create_status_check()
    tester.test_get_status_checks()
    
    # Print summary
    tester.print_summary()
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
