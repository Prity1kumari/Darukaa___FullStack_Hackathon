import os
import sys

os.environ["ENVIRONMENT"] = "test"
os.environ["SECRET_KEY"] = "test-secret-key-at-least-32-chars-long-darukaa"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest

if __name__ == "__main__":
    print("Running backend pytest test suite...")
    exit_code = pytest.main([
        "tests",
        "-v",
        "-p", "no:xdist",
        "-p", "no:rerunfailures",
        "-p", "no:repeat",
        "-s",
    ])
    sys.exit(exit_code)
