"""new association table between properties and values

Revision ID: fd8b0e645dec
Revises: 953c5e0cebad
Create Date: 2016-06-20 11:27:09.237419

"""

# revision identifiers, used by Alembic.
revision = 'fd8b0e645dec'
down_revision = '953c5e0cebad'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.drop_table('association')
    op.create_table('association',
            sa.Column('id', sa.INTEGER()),
            sa.Column('property_id', sa.INTEGER(), nullable=False),
            sa.Column('value_id', sa.INTEGER(), nullable=False),
            sa.ForeignKeyConstraint(['property_id'], ['property.id'], ),
            sa.ForeignKeyConstraint(['value_id'], ['value.id'], ),
            sa.PrimaryKeyConstraint('id'))


def downgrade():
    op.drop_table('association')
    op.create_table('association',
            sa.Column('property_id', sa.INTEGER()),
            sa.Column('value_id', sa.INTEGER()),
            sa.ForeignKeyConstraint(['property_id'], ['property.id'], ),
            sa.ForeignKeyConstraint(['value_id'], ['value.id'], ))
