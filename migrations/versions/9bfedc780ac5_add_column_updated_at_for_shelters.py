"""add column updated_at for shelters

Revision ID: 9bfedc780ac5
Revises:
Create Date: 2016-06-17 08:48:58.772966

"""

# revision identifiers, used by Alembic.
revision = '9bfedc780ac5'
down_revision = None
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa

from datetime import datetime


def upgrade():
    op.add_column('shelter', sa.Column('updated_at', sa.Boolean(),
                    default=datetime.now))


def downgrade():
    op.drop_column('shelter', 'updated_at')
