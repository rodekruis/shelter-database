"""add column preferred_language in the table User

Revision ID: c6d598fbe4bb
Revises: fd8b0e645dec
Create Date: 2016-06-20 20:38:10.894092

"""

# revision identifiers, used by Alembic.
revision = 'c6d598fbe4bb'
down_revision = 'fd8b0e645dec'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('user', sa.Column('preferred_language', sa.String(),
                    default='en'))


def downgrade():
    op.drop_column('user', 'preferred_language')
