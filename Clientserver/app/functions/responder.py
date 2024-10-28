import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.end import Endpoint
from sqlalchemy.exc import SQLAlchemyError

# Define placeholders for special characters
DOUBLE_QUOTE_PLACEHOLDER = "[[DQ]]"
COLON_PLACEHOLDER = "[[COLON]]"
COMMA_PLACEHOLDER = "[[COMMA]]"

def replace_special_characters(text: str) -> str:
    """Replace special characters with placeholders."""
    text = text.replace('"', DOUBLE_QUOTE_PLACEHOLDER)
    text = text.replace(':', COLON_PLACEHOLDER)
    text = text.replace(',', COMMA_PLACEHOLDER)
    return text

def restore_special_characters(text: str) -> str:
    """Restore special characters from placeholders."""
    text = text.replace(DOUBLE_QUOTE_PLACEHOLDER, '"')
    text = text.replace(COLON_PLACEHOLDER, ':')
    text = text.replace(COMMA_PLACEHOLDER, ',')
    return text

async def save_data(db: AsyncSession, projid: int, endpoint: str, payload: dict):
    try:
        # Convert payload to JSON string and replace special characters
        payload_str = json.dumps(payload)
        payload_str_with_placeholders = replace_special_characters(payload_str)

        # Create a new Endpoint record (adjust as per your model)
        new_endpoint = Endpoint(Projectid=projid, Endpoint=endpoint, Payload=payload_str_with_placeholders)
        db.add(new_endpoint)
        await db.commit()
    except SQLAlchemyError as e:
        print(f"Database error during saving: {e}")
        await db.rollback()

async def get_response(db: AsyncSession, endpoint: str, projid: int):
    try:
        print("Retrieving endpoint data...")
        print(f"Project ID: {projid}")
        print(f"Endpoint: {endpoint}")

        # Construct the SQLAlchemy query
        stmt = select(Endpoint).where(
            Endpoint.Projectid == projid,
            Endpoint.Endpoint == endpoint
        )

        # Execute the query
        result = await db.execute(stmt)
        endpoint_record = result.scalar_one_or_none()

        print("Retrieved endpoint record:", endpoint_record)

        if endpoint_record:
            # Restore Payload from placeholders to valid JSON
            payload_with_placeholders = endpoint_record.Payload
            restored_payload = restore_special_characters(payload_with_placeholders)

            # Parse the payload back to JSON
            return json.loads(restored_payload)
        else:
            return {"error": "No matching record found for the given project ID and endpoint"}

    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return {"error": "Database error occurred"}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": "An unexpected error occurred"}
