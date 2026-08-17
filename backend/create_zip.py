import zipfile
import os

# Directories and files to exclude
exclude_dirs = {'.env', '__pycache__', 'flask_session', '.git', 'venv', 'migrations', '.vscode'}
exclude_files = {'create_zip.py', '.env'}

# Create zip file
with zipfile.ZipFile('../backend-deploy.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        # Remove excluded directories from dirs list
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            # Skip excluded files
            if file in exclude_files or file.endswith('.pyc'):
                continue
            
            filepath = os.path.join(root, file)
            # Use forward slashes for Linux compatibility
            arcname = filepath.replace('\\', '/').lstrip('./')
            zipf.write(filepath, arcname)
            print(f"Added: {arcname}")

print("\nZip file created successfully: backend-deploy.zip")
