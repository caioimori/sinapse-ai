@echo off
:: DeepSeek Usage Statistics CLI
:: View usage tracking data per alias

setlocal

:: Try multiple locations for the tracker script
:: 1. Environment variable (if set during installation)
if defined SINAPSE_HOME (
    set "TRACKER_SCRIPT=%SINAPSE_HOME%\.sinapse-ai\infrastructure\scripts\llm-routing\usage-tracker\index.js"
    if exist "%TRACKER_SCRIPT%" goto :found
)

:: 2. Common installation locations
set "TRACKER_SCRIPT=%USERPROFILE%\sinapse-ai\.sinapse-ai\infrastructure\scripts\llm-routing\usage-tracker\index.js"
if exist "%TRACKER_SCRIPT%" goto :found

set "TRACKER_SCRIPT=%USERPROFILE%\Workspaces\SINAPSE\SinapseAI\sinapse-ai\.sinapse-ai\infrastructure\scripts\llm-routing\usage-tracker\index.js"
if exist "%TRACKER_SCRIPT%" goto :found

:: 3. Relative to this script (for development)
set "TRACKER_SCRIPT=%~dp0..\usage-tracker\index.js"
if exist "%TRACKER_SCRIPT%" goto :found

:: 4. Global npm package location
set "TRACKER_SCRIPT=%APPDATA%\npm\node_modules\@sinapse-fullstack\core\.sinapse-ai\infrastructure\scripts\llm-routing\usage-tracker\index.js"
if exist "%TRACKER_SCRIPT%" goto :found

echo [91mERROR: Usage tracker not found![0m
echo.
echo Please ensure SINAPSE is installed correctly.
echo Expected locations:
echo   - %%SINAPSE_HOME%%\.sinapse-ai\infrastructure\scripts\llm-routing\usage-tracker\
echo   - %%USERPROFILE%%\sinapse-ai\.sinapse-ai\infrastructure\scripts\llm-routing\usage-tracker\
echo.
echo Set SINAPSE_HOME environment variable: setx SINAPSE_HOME "C:\path\to\sinapse-ai"
exit /b 1

:found
:: Check if Node.js is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mERROR: Node.js not found in PATH[0m
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

:: Pass arguments to tracker
node "%TRACKER_SCRIPT%" usage %*

endlocal
