# Investment Fund Scraper 📊

Aplicación gráfica desarrollada en Python para obtener y analizar datos de fondos de inversión mediante web scraping desde **Yahoo Finance** e **Investing.com**.

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Características ✨

- **Múltiples fuentes de datos**: Yahoo Finance e Investing.com
- **Interfaz gráfica intuitiva**: Desarrollada con Tkinter
- **Análisis completo**: Obtén precios, rendimientos, volatilidad y métricas clave
- **Visualización de datos**: Gráficos interactivos con Matplotlib
- **Comparación de fondos**: Compara el rendimiento de múltiples fondos simultáneamente
- **Datos históricos personalizados**: Selecciona períodos específicos de análisis
- **Exportación de datos**: Exporta resultados a CSV y Excel
- **Guardado de gráficos**: Guarda visualizaciones en PNG o PDF

## Capturas de Pantalla 📸

La aplicación cuenta con 3 pestañas principales:

1. **Búsqueda y Análisis**: Busca fondos individuales y obtén información detallada
2. **Comparar Fondos**: Compara el rendimiento de múltiples fondos
3. **Datos Históricos**: Analiza períodos personalizados

## Requisitos 📋

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## Instalación 🔧

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/investment-fund-scraper.git
cd investment-fund-scraper
```

### 2. Crear un entorno virtual (recomendado)

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

**Nota**: En algunas distribuciones de Linux, es posible que necesites instalar tkinter por separado:

```bash
# Ubuntu/Debian
sudo apt-get install python3-tk

# Fedora
sudo dnf install python3-tkinter

# Arch Linux
sudo pacman -S tk
```

## Uso 🚀

### Iniciar la aplicación

```bash
python main.py
```

### Ejemplos de uso

#### 1. Buscar un fondo en Yahoo Finance

1. Selecciona "Yahoo Finance" como fuente de datos
2. Ingresa el símbolo del fondo (ej: `SPY`, `VFIAX`, `QQQ`)
3. Selecciona el período de tiempo deseado
4. Haz clic en "Buscar"

**Símbolos populares de fondos:**
- `SPY` - SPDR S&P 500 ETF Trust
- `QQQ` - Invesco QQQ Trust (NASDAQ-100)
- `IWM` - iShares Russell 2000 ETF
- `VFIAX` - Vanguard 500 Index Fund
- `VTI` - Vanguard Total Stock Market ETF
- `AGG` - iShares Core U.S. Aggregate Bond ETF

#### 2. Buscar un fondo en Investing.com

1. Selecciona "Investing.com" como fuente de datos
2. Ingresa el nombre del fondo (ej: "Vanguard Total Stock Market")
3. Haz clic en "Buscar"

#### 3. Comparar múltiples fondos

1. Ve a la pestaña "Comparar Fondos"
2. Ingresa los símbolos separados por comas (ej: `SPY,QQQ,IWM`)
3. Haz clic en "Comparar"
4. Observa el gráfico de rendimientos relativos y las estadísticas

#### 4. Analizar datos históricos personalizados

1. Ve a la pestaña "Datos Históricos"
2. Ingresa el símbolo del fondo
3. Especifica las fechas de inicio y fin (formato: YYYY-MM-DD)
4. Haz clic en "Obtener Datos"

#### 5. Exportar datos

- **CSV**: Haz clic en "Exportar a CSV" para guardar los datos en formato CSV
- **Excel**: Haz clic en "Exportar a Excel" para guardar en formato .xlsx
- **Gráficos**: Haz clic en "Guardar Gráfico" para guardar la visualización

## Estructura del Proyecto 📁

```
investment-fund-scraper/
├── main.py                          # Punto de entrada de la aplicación
├── requirements.txt                 # Dependencias del proyecto
├── README.md                        # Este archivo
├── LICENSE                          # Licencia MIT
└── src/
    ├── __init__.py
    ├── gui/
    │   ├── __init__.py
    │   └── main_window.py          # Interfaz gráfica principal
    └── scrapers/
        ├── __init__.py
        ├── yahoo_finance_scraper.py    # Scraper para Yahoo Finance
        └── investing_scraper.py        # Scraper para Investing.com
```

## Tecnologías Utilizadas 🛠️

- **Python 3.8+**: Lenguaje de programación principal
- **Tkinter**: Framework para la interfaz gráfica
- **yfinance**: Librería para obtener datos de Yahoo Finance
- **BeautifulSoup4**: Web scraping de Investing.com
- **Requests**: Peticiones HTTP
- **Pandas**: Procesamiento y análisis de datos
- **Matplotlib**: Visualización de gráficos
- **NumPy**: Cálculos numéricos

## Características de los Scrapers 🔍

### Yahoo Finance Scraper

- ✅ Datos históricos de precios
- ✅ Información del fondo (nombre, categoría, familia)
- ✅ Métricas de rendimiento
- ✅ Volatilidad y drawdown máximo
- ✅ Períodos personalizados
- ✅ Comparación de múltiples fondos

### Investing.com Scraper

- ✅ Información general del fondo
- ✅ Precio actual y cambio porcentual
- ✅ Búsqueda por nombre
- ✅ Múltiples resultados de búsqueda
- ⚠️ Datos históricos limitados (requiere análisis adicional del sitio)

## Métricas Calculadas 📈

La aplicación calcula automáticamente:

- **Rendimiento Total (%)**: Ganancia/pérdida total en el período
- **Volatilidad Diaria (%)**: Desviación estándar de rendimientos diarios
- **Drawdown Máximo (%)**: Mayor caída desde un máximo
- **Precio Máximo/Mínimo**: Rango de precios en el período
- **Precio Promedio**: Media de precios de cierre
- **Volumen Promedio**: Volumen de negociación promedio

## Limitaciones y Consideraciones ⚠️

1. **Yahoo Finance**:
   - Funciona mejor con ETFs y fondos indexados estadounidenses
   - Algunos fondos mutuos pueden no tener símbolos disponibles

2. **Investing.com**:
   - El scraping puede fallar si el sitio cambia su estructura HTML
   - Algunos datos pueden no estar disponibles para todos los fondos
   - Se recomienda respetar los términos de servicio del sitio

3. **Rate Limiting**:
   - La aplicación incluye pausas entre consultas para no sobrecargar los servidores
   - Evita hacer demasiadas consultas en poco tiempo

## Solución de Problemas 🔧

### Error: "No se pudo obtener datos"

- Verifica que el símbolo del fondo sea correcto
- Comprueba tu conexión a internet
- Para Yahoo Finance, busca el símbolo correcto en finance.yahoo.com
- Algunos fondos pueden no tener datos disponibles

### Error: "ModuleNotFoundError"

Asegúrate de haber instalado todas las dependencias:
```bash
pip install -r requirements.txt
```

### Error: "tkinter no disponible"

En Linux, instala tkinter según tu distribución (ver sección de Instalación)

### La aplicación se cierra inesperadamente

Ejecuta desde terminal para ver mensajes de error:
```bash
python main.py
```

## Contribuciones 🤝

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Mejoras Futuras 🚀

- [ ] Soporte para más fuentes de datos (Bloomberg, Morningstar)
- [ ] Alertas de precio
- [ ] Backtesting de estrategias
- [ ] Análisis técnico (RSI, MACD, Medias Móviles)
- [ ] Exportación a bases de datos
- [ ] API REST para integración con otras aplicaciones
- [ ] Modo oscuro
- [ ] Traducción a múltiples idiomas

## Licencia 📄

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Disclaimer ⚖️

Esta aplicación es solo para fines educativos e informativos. No constituye asesoramiento financiero. Siempre consulta con un profesional financiero antes de tomar decisiones de inversión.

El scraping de sitios web debe realizarse de acuerdo con los términos de servicio de cada sitio. Usa esta herramienta de manera responsable.

## Autor ✒️

Desarrollado con ❤️ para analistas e inversores

## Soporte 💬

Si encuentras algún problema o tienes sugerencias, por favor abre un [issue](https://github.com/tu-usuario/investment-fund-scraper/issues).

---

**¡Feliz análisis de inversiones!** 📊💰
