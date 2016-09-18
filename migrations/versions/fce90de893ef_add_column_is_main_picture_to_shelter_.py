"""Add column is_main_picture to shelter_picture table

Revision ID: fce90de893ef
Revises: c5cf60c29302
Create Date: 2016-09-07 15:09:19.276356

"""

# revision identifiers, used by Alembic.
revision = 'fce90de893ef'
down_revision = 'c5cf60c29302'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('shelter_picture', sa.Column('is_main_picture', sa.Boolean(),
                    default=False))


def downgrade():
    op.drop_column('shelter_picture', 'is_main_picture')
