"""add_game_appid_to_conversations

Revision ID: 1bec10633980
Revises: 7021b3dd42c5
Create Date: 2025-11-22 21:48:08.269633

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1bec10633980'
down_revision = '7021b3dd42c5'
branch_labels = None
depends_on = None


def upgrade():
    # Add game_appid column to conversations table
    op.add_column('conversations', sa.Column('game_appid', sa.Integer(), nullable=True))


def downgrade():
    # Remove game_appid column from conversations table
    op.drop_column('conversations', 'game_appid')
