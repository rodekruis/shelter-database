"""add new section table

Revision ID: c5cf60c29302
Revises: c6d598fbe4bb
Create Date: 2016-06-21 13:26:54.041246

"""

# revision identifiers, used by Alembic.
revision = 'c5cf60c29302'
down_revision = 'c6d598fbe4bb'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table('section',
            sa.Column('id', sa.INTEGER()),
            sa.Column('name', sa.String(), default=''),
            sa.PrimaryKeyConstraint('id'))
    op.add_column('category', sa.Column('section_id', sa.INTEGER()))
    sa.ForeignKeyConstraint(['section_id'], ['section.id'])


def downgrade():
    op.drop_table('section')
    op.drop_column('category', 'section_id')
