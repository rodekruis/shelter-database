"""fix the type of the updated_at column for shelters

Revision ID: 953c5e0cebad
Revises: 9bfedc780ac5
Create Date: 2016-06-17 09:00:35.875583

"""

# revision identifiers, used by Alembic.
revision = '953c5e0cebad'
down_revision = '9bfedc780ac5'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa

from datetime import datetime

def upgrade():
    op.drop_column('shelter', 'updated_at')
    op.add_column('shelter', sa.Column('updated_at', sa.DateTime(),
                    default=datetime.now))


def downgrade():
    op.drop_column('shelter', 'updated_at')
    op.add_column('shelter', sa.Column('updated_at', sa.Boolean(),
                    default=datetime.now))
