@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set WRAPPER_JAR="%~dp0\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_PROPERTIES="%~dp0\.mvn\wrapper\maven-wrapper.properties"

@REM Check if Maven is already installed
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Maven found in PATH. Using system Maven.
    mvn %*
    goto end
)

@REM Check if wrapper jar exists
if exist %WRAPPER_JAR% (
    echo Using Maven Wrapper...
    java -jar %WRAPPER_JAR% %*
    goto end
)

@REM Download Maven Wrapper
echo Maven not found. Downloading Maven Wrapper...
mkdir "%~dp0\.mvn\wrapper" 2>nul

@REM Download the wrapper jar using PowerShell
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%~dp0\.mvn\wrapper\maven-wrapper.jar' }"

@REM Create properties file
echo distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip > "%~dp0\.mvn\wrapper\maven-wrapper.properties"

echo Maven Wrapper downloaded. Running...
java -jar %WRAPPER_JAR% %*

:end
endlocal
