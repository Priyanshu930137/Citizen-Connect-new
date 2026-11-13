"""Create or refresh local demo accounts for every Citizen Connect role."""

from database import Base, SessionLocal, engine
import models
from auth_utils import hash_password


DEPARTMENTS = [
    "Public Works Department",
    "Water Supply Department",
    "Electricity Department",
    "Municipal Corporation",
    "Police Department",
    "Health Department",
    "Traffic Management Department",
    "Public Administration",
]
DEMO_PASSWORD = "Demo@12345"


def slug(value: str) -> str:
    return value.lower().replace(" department", "").replace(" ", "-")


def main() -> None:
    Base.metadata.create_all(bind=engine)
    accounts = [
        ("Site Administrator", "admin@citizenconnect.local", "authority", None),
        ("Demo Citizen", "citizen@citizenconnect.local", "citizen", None),
    ]
    for department in DEPARTMENTS:
        key = slug(department)
        accounts.extend([
            (f"{department} Manager", f"manager.{key}@citizenconnect.local", "management", department),
            (f"{department} Technician", f"tech.{key}@citizenconnect.local", "technician", department),
        ])

    db = SessionLocal()
    try:
        for name, email, role, department in accounts:
            user = db.query(models.User).filter(models.User.email == email).first()
            if user is None:
                user = models.User(name=name, email=email, role=role)
                db.add(user)
            user.name = name
            user.password = hash_password(DEMO_PASSWORD)
            user.role = role
            user.department = department
        db.commit()
    finally:
        db.close()

    print(f"Seeded {len(accounts)} demo accounts; password: {DEMO_PASSWORD}")
    print("See README.md for the full account email list.")


if __name__ == "__main__":
    main()
