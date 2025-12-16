# PowerShell script to set up Maven and run Spring Boot

Write-Host "=== SQL Learning Lab Backend Setup ===" -ForegroundColor Cyan

$backendDir = $PSScriptRoot
if (-not $backendDir) {
    $backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}

$mvnWrapperDir = Join-Path $backendDir ".mvn\wrapper"
$mvnWrapperJar = Join-Path $mvnWrapperDir "maven-wrapper.jar"
$mvnWrapperProps = Join-Path $mvnWrapperDir "maven-wrapper.properties"

# Create .mvn/wrapper directory
if (-not (Test-Path $mvnWrapperDir)) {
    New-Item -ItemType Directory -Path $mvnWrapperDir -Force | Out-Null
    Write-Host "Created .mvn/wrapper directory" -ForegroundColor Green
}

# Download Maven Wrapper JAR if not present
if (-not (Test-Path $mvnWrapperJar)) {
    Write-Host "Downloading Maven Wrapper..." -ForegroundColor Yellow
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    try {
        Invoke-WebRequest -Uri "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar" -OutFile $mvnWrapperJar
        Write-Host "Maven Wrapper downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download Maven Wrapper: $_" -ForegroundColor Red
        exit 1
    }
}

# Create properties file if not present
if (-not (Test-Path $mvnWrapperProps)) {
    "distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip" | Out-File -FilePath $mvnWrapperProps -Encoding UTF8
    Write-Host "Created maven-wrapper.properties" -ForegroundColor Green
}

# Check for Java
$javaPath = Get-Command java -ErrorAction SilentlyContinue
if (-not $javaPath) {
    Write-Host "ERROR: Java not found! Please install Java 17 or later." -ForegroundColor Red
    exit 1
}

Write-Host "`nJava found: $($javaPath.Source)" -ForegroundColor Green

# Run Maven to download dependencies
Write-Host "`n=== Downloading Dependencies (this may take a few minutes) ===" -ForegroundColor Cyan
Push-Location $backendDir
try {
    java -jar $mvnWrapperJar dependency:resolve
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n=== Dependencies Downloaded Successfully! ===" -ForegroundColor Green
        
        # Ask to run
        $run = Read-Host "`nRun Spring Boot now? (y/n)"
        if ($run -eq 'y' -or $run -eq 'Y') {
            Write-Host "`n=== Starting Spring Boot ===" -ForegroundColor Cyan
            java -jar $mvnWrapperJar spring-boot:run
        }
    } else {
        Write-Host "Maven dependency resolution failed. Check pom.xml" -ForegroundColor Red
    }
} finally {
    Pop-Location
}
