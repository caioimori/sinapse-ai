<!--
  Traducción: ES
  Original: /docs/en/uninstallation.md
  Última sincronización: 2026-01-26
-->

# Guía de Desinstalación

> 🌐 [EN](../uninstallation.md) | [PT](../pt/uninstallation.md) | **ES**

---

Esta guía proporciona instrucciones completas para desinstalar SINAPSE de su sistema.

## Tabla de Contenidos

1. [Antes de Desinstalar](#antes-de-desinstalar)
2. [Desinstalación Rápida](#desinstalación-rápida)
3. [Desinstalación Completa](#desinstalación-completa)
4. [Desinstalación Selectiva](#desinstalación-selectiva)
5. [Preservación de Datos](#preservación-de-datos)
6. [Eliminación Limpia del Sistema](#eliminación-limpia-del-sistema)
7. [Resolución de Problemas de Desinstalación](#resolución-de-problemas-de-desinstalación)
8. [Limpieza Post-Desinstalación](#limpieza-post-desinstalación)
9. [Reinstalación](#reinstalación)

## Antes de Desinstalar

### Consideraciones Importantes

⚠️ **Advertencia**: Desinstalar SINAPSE:

- Eliminará todos los archivos del framework
- Borrará configuraciones de agentes (a menos que se preserven)
- Limpiará datos de la capa de memoria (a menos que se respalden)
- Eliminará todos los flujos de trabajo personalizados
- Borrará logs y archivos temporales

### Checklist Pre-Desinstalación

- [ ] Respaldar datos importantes
- [ ] Exportar agentes y flujos de trabajo personalizados
- [ ] Guardar claves API y configuraciones
- [ ] Documentar modificaciones personalizadas
- [ ] Detener todos los procesos en ejecución
- [ ] Informar a los miembros del equipo

### Respalde Sus Datos

```bash
# Crear respaldo completo
npx sinapse-ai backup --complete

# O respaldar manualmente directorios importantes
tar -czf sinapse-backup-$(date +%Y%m%d).tar.gz \
  .sinapse/ \
  agents/ \
  workflows/ \
  tasks/ \
  --exclude=.sinapse/logs \
  --exclude=.sinapse/cache
```

## Desinstalación Rápida

### Usando el Desinstalador Incorporado

La forma más rápida de desinstalar SINAPSE:

```bash
# Desinstalación básica (preserva datos de usuario)
npx sinapse-ai uninstall

# Desinstalación completa (elimina todo)
npx sinapse-ai uninstall --complete

# Desinstalación con preservación de datos
npx sinapse-ai uninstall --keep-data
```

### Desinstalación Interactiva

Para desinstalación guiada:

```bash
npx sinapse-ai uninstall --interactive
```

Esto le preguntará:

- Qué mantener/eliminar
- Opciones de respaldo
- Confirmación para cada paso

## Desinstalación Completa

### Paso 1: Detener Todos los Servicios

```bash
# Detener todos los agentes en ejecución
*deactivate --all

# Detener todos los flujos de trabajo
*stop-workflow --all

# Apagar meta-agent
*shutdown
```

### Paso 2: Exportar Datos Importantes

```bash
# Exportar configuraciones
*export config --destination backup/config.json

# Exportar agentes
*export agents --destination backup/agents/

# Exportar flujos de trabajo
*export workflows --destination backup/workflows/

# Exportar datos de memoria
*export memory --destination backup/memory.zip
```

### Paso 3: Ejecutar el Desinstalador

```bash
# Eliminación completa
npx sinapse-ai uninstall --complete --no-backup
```

### Paso 4: Eliminar Instalación Global

```bash
# Eliminar paquete npm global
npm uninstall -g sinapse-ai

# Eliminar cache de npx
npm cache clean --force
```

### Paso 5: Limpiar Archivos del Sistema

#### Windows

```powershell
# Eliminar archivos de AppData
Remove-Item -Recurse -Force "$env:APPDATA\sinapse-ai"

# Eliminar archivos temporales
Remove-Item -Recurse -Force "$env:TEMP\sinapse-*"

# Eliminar entradas del registro (si las hay)
Remove-Item -Path "HKCU:\Software\SINAPSE" -Recurse
```

#### macOS/Linux

```bash
# Eliminar archivos de configuración
rm -rf ~/.sinapse
rm -rf ~/.config/sinapse-ai

# Eliminar cache
rm -rf ~/.cache/sinapse-ai

# Eliminar archivos temporales
rm -rf /tmp/sinapse-*
```

## Desinstalación Selectiva

### Eliminar Componentes Específicos

```bash
# Eliminar solo agentes
npx sinapse-ai uninstall agents

# Eliminar solo flujos de trabajo
npx sinapse-ai uninstall workflows

# Eliminar capa de memoria
npx sinapse-ai uninstall memory-layer

# Eliminar agente específico
*uninstall agent-name
```

### Mantener Core, Eliminar Extensiones

```bash
# Eliminar todos los plugins
*plugin remove --all

# Eliminar Squads
rm -rf Squads/

# Eliminar plantillas personalizadas
rm -rf templates/custom/
```

## Preservación de Datos

### Qué Mantener

Antes de desinstalar, identifique lo que desea preservar:

1. **Agentes Personalizados**

   ```bash
   # Copiar agentes personalizados
   cp -r agents/custom/ ~/sinapse-backup/agents/
   ```

2. **Flujos de Trabajo y Tareas**

   ```bash
   # Copiar flujos de trabajo
   cp -r workflows/ ~/sinapse-backup/workflows/
   cp -r tasks/ ~/sinapse-backup/tasks/
   ```

3. **Datos de Memoria**

   ```bash
   # Exportar base de datos de memoria
   *memory export --format sqlite \
     --destination ~/sinapse-backup/memory.db
   ```

4. **Configuraciones**

   ```bash
   # Copiar todos los archivos de configuración
   cp .sinapse/config.json ~/sinapse-backup/
   cp .env ~/sinapse-backup/
   ```

5. **Código Personalizado**
   ```bash
   # Encontrar y respaldar archivos personalizados
   find . -name "*.custom.*" -exec cp {} ~/sinapse-backup/custom/ \;
   ```

### Script de Preservación

Crear `preserve-data.sh`:

```bash
#!/bin/bash
BACKUP_DIR="$HOME/sinapse-backup-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Función de respaldo
backup_if_exists() {
    if [ -e "$1" ]; then
        echo "Backing up $1..."
        cp -r "$1" "$BACKUP_DIR/"
    fi
}

# Respaldar todos los datos importantes
backup_if_exists ".sinapse"
backup_if_exists "agents"
backup_if_exists "workflows"
backup_if_exists "tasks"
backup_if_exists "templates"
backup_if_exists ".env"
backup_if_exists "package.json"

echo "Backup completed at: $BACKUP_DIR"
```

## Eliminación Limpia del Sistema

### Script de Limpieza Completa

Crear `clean-uninstall.sh`:

```bash
#!/bin/bash
echo "SINAPSE Complete Uninstall"
echo "================================="

# Confirmación
read -p "This will remove ALL SINAPSE data. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Detener todos los procesos
echo "Stopping all processes..."
pkill -f "sinapse-ai" || true
pkill -f "sinapse-developer" || true

# Eliminar archivos del proyecto
echo "Removing project files..."
rm -rf .sinapse/
rm -rf agents/
rm -rf workflows/
rm -rf tasks/
rm -rf templates/
rm -rf Squads/
rm -rf node_modules/sinapse-ai/

# Eliminar archivos globales
echo "Removing global files..."
npm uninstall -g sinapse-ai

# Eliminar datos de usuario
echo "Removing user data..."
rm -rf ~/.sinapse
rm -rf ~/.config/sinapse-ai
rm -rf ~/.cache/sinapse-ai

# Limpiar cache de npm
echo "Cleaning npm cache..."
npm cache clean --force

# Eliminar de package.json
echo "Updating package.json..."
npm uninstall sinapse-ai/core
npm uninstall sinapse-ai/memory
npm uninstall sinapse-ai/meta-agent

echo "Uninstall complete!"
```

### Limpieza del Registro (Windows)

```powershell
# Script PowerShell para limpieza de Windows
Write-Host "Cleaning SINAPSE from Windows Registry..."

# Eliminar del PATH
$path = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = ($path.Split(';') | Where-Object { $_ -notmatch 'sinapse-ai' }) -join ';'
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

# Eliminar claves del registro
Remove-ItemProperty -Path "HKCU:\Environment" -Name "SINAPSE_*" -ErrorAction SilentlyContinue

# Eliminar asociaciones de archivos
Remove-Item -Path "HKCU:\Software\Classes\.sinapse" -Recurse -ErrorAction SilentlyContinue

Write-Host "Registry cleanup complete!"
```

## Resolución de Problemas de Desinstalación

### Problemas Comunes

#### 1. Permiso Denegado

```bash
# Linux/macOS
sudo npx sinapse-ai uninstall --complete

# Windows (Ejecutar como Administrador)
npx sinapse-ai uninstall --complete
```

#### 2. Proceso Todavía en Ejecución

```bash
# Forzar detención de todos los procesos
# Linux/macOS
killall -9 node
killall -9 sinapse-ai

# Windows
taskkill /F /IM node.exe
taskkill /F /IM sinapse-ai.exe
```

#### 3. Archivos Bloqueados

```bash
# Encontrar procesos usando archivos
# Linux/macOS
lsof | grep sinapse

# Windows (PowerShell)
Get-Process | Where-Object {$_.Path -like "*sinapse*"}
```

#### 4. Eliminación Incompleta

```bash
# Limpieza manual
find . -name "*sinapse*" -type d -exec rm -rf {} +
find . -name "*.sinapse*" -type f -delete
```

### Desinstalación Forzada

Si la desinstalación normal falla:

```bash
#!/bin/bash
# force-uninstall.sh
echo "Force uninstalling SINAPSE..."

# Matar todos los procesos relacionados
pkill -9 -f sinapse || true

# Eliminar todos los archivos
rm -rf .sinapse* sinapse* *sinapse*
rm -rf agents workflows tasks templates
rm -rf node_modules/sinapse-ai
rm -rf ~/.sinapse* ~/.config/sinapse* ~/.cache/sinapse*

# Limpiar npm
npm cache clean --force
npm uninstall -g sinapse-ai

echo "Force uninstall complete!"
```

## Limpieza Post-Desinstalación

### 1. Verificar Eliminación

```bash
# Buscar archivos restantes
find . -name "*sinapse*" 2>/dev/null
find ~ -name "*sinapse*" 2>/dev/null

# Verificar paquetes npm
npm list -g | grep sinapse
npm list | grep sinapse

# Verificar procesos en ejecución
ps aux | grep sinapse
```

### 2. Limpiar Variables de Entorno

```bash
# Eliminar de .bashrc/.zshrc
sed -i '/SINAPSE_/d' ~/.bashrc
sed -i '/sinapse-ai/d' ~/.bashrc

# Eliminar de archivos .env
find . -name ".env*" -exec sed -i '/SINAPSE_/d' {} \;
```

### 3. Actualizar Archivos del Proyecto

```javascript
// Eliminar de los scripts de package.json
{
  "scripts": {
    // Eliminar estas entradas
    "sinapse": "sinapse-ai",
    "meta-agent": "sinapse-ai meta-agent"
  }
}
```

### 4. Limpiar Repositorio Git

```bash
# Eliminar hooks de git específicos de SINAPSE
rm -f .git/hooks/*sinapse*

# Actualizar .gitignore
sed -i '/.sinapse/d' .gitignore
sed -i '/sinapse-/d' .gitignore

# Commit de eliminación
git add -A
git commit -m "Remove SINAPSE"
```

## Reinstalación

### Después de Desinstalación Completa

Si desea reinstalar SINAPSE:

1. **Esperar la limpieza**

   ```bash
   # Asegurar que todos los procesos se detuvieron
   sleep 5
   ```

2. **Limpiar cache de npm**

   ```bash
   npm cache clean --force
   ```

3. **Instalación fresca**
   ```bash
   npx sinapse-ai@latest init my-project
   ```

### Restaurar desde Respaldo

```bash
# Restaurar datos guardados
cd my-project

# Restaurar configuraciones
cp ~/sinapse-backup/config.json .sinapse/

# Restaurar agentes
cp -r ~/sinapse-backup/agents/* ./agents/

# Importar memoria
*memory import ~/sinapse-backup/memory.zip

# Verificar restauración
*doctor --verify-restore
```

## Checklist de Verificación de Desinstalación

- [ ] Todos los procesos SINAPSE detenidos
- [ ] Archivos del proyecto eliminados
- [ ] Paquete npm global desinstalado
- [ ] Archivos de configuración de usuario eliminados
- [ ] Directorios de cache limpiados
- [ ] Variables de entorno eliminadas
- [ ] Entradas del registro limpiadas (Windows)
- [ ] Repositorio Git actualizado
- [ ] No se encontraron archivos SINAPSE restantes
- [ ] PATH del sistema actualizado

## Obtener Ayuda

Si encuentra problemas durante la desinstalación:

1. **Consultar Documentación**
   - [FAQ](https://github.com/SynkraAI/sinapse-ai/wiki/faq#uninstall)
   - [Solución de Problemas](https://github.com/SynkraAI/sinapse-ai/wiki/troubleshooting)

2. **Soporte de la Comunidad**
   - Discord: #uninstall-help
   - GitHub Issues: Etiquetar con "uninstall"

3. **Soporte de Emergencia**
   ```bash
   # Generar reporte de desinstalación
   npx sinapse-ai diagnose --uninstall > uninstall-report.log
   ```

---

**Recuerde**: Siempre respalde sus datos antes de desinstalar. El proceso de desinstalación es irreversible, y la recuperación de datos puede no ser posible sin respaldos adecuados.
