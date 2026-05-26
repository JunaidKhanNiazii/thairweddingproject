# Install JSZip Package

To enable the "Download All" feature (zip file download), you need to install the jszip package.

## Installation

Open your terminal (Command Prompt or PowerShell as Administrator) and run:

```bash
npm install jszip
```

## If you get PowerShell execution policy error:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Then run: `npm install jszip`

## Alternative:

Use Command Prompt (cmd.exe) instead of PowerShell:
```
npm install jszip
```

After installation, the download features will work:
- ✅ Individual photo download (icon on each image)
- ✅ Download all photos as a zip file
