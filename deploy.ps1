# Zelvra one-command redeploy: stages everything, commits, pushes to GitHub Pages.
# Usage:  .\deploy.ps1 "what changed"
param([string]$Message = "Update site")

git add -A
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nothing to commit (or commit failed). Pushing any unpushed commits..."
}
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployed. GitHub Pages rebuilds in ~1 minute: https://zelvra.tech/"
} else {
    Write-Host "Push failed — check network / credentials (git push origin main)."
}
