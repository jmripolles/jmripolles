#!/usr/bin/env python3
"""
Investment Fund Scraper - Versión Standalone
Aplicación gráfica para obtener y analizar datos de fondos de inversión
desde Yahoo Finance e Investing.com

Versión todo-en-uno: No requiere estructura de carpetas, solo este archivo.

Autor: Investment Fund Scraper
Versión: 1.0.0
Licencia: MIT
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext, filedialog
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import time
import re

# ============================================================================
# SCRAPERS - Yahoo Finance
# ============================================================================

try:
    import yfinance as yf
    YAHOO_AVAILABLE = True
except ImportError:
    YAHOO_AVAILABLE = False
    print("Advertencia: yfinance no está instalado. Yahoo Finance no estará disponible.")


class YahooFinanceScraper:
    """
    Clase para obtener datos de fondos de inversión desde Yahoo Finance
    """

    def __init__(self):
        self.data = None
        self.ticker = None
        if not YAHOO_AVAILABLE:
            raise ImportError("yfinance no está instalado. Instálalo con: pip install yfinance")

    def get_fund_data(self, symbol: str, period: str = "1y") -> Optional[pd.DataFrame]:
        """
        Obtiene datos históricos de un fondo de inversión

        Args:
            symbol: Símbolo del fondo (ej: 'SPY', 'VFIAX')
            period: Período de tiempo ('1mo', '3mo', '6mo', '1y', '2y', '5y', 'max')

        Returns:
            DataFrame con datos históricos o None si hay error
        """
        try:
            self.ticker = symbol
            fund = yf.Ticker(symbol)
            self.data = fund.history(period=period)

            if self.data.empty:
                return None

            return self.data

        except Exception as e:
            print(f"Error obteniendo datos de {symbol}: {str(e)}")
            return None

    def get_fund_info(self, symbol: str) -> Optional[Dict]:
        """
        Obtiene información general del fondo

        Args:
            symbol: Símbolo del fondo

        Returns:
            Diccionario con información del fondo o None si hay error
        """
        try:
            fund = yf.Ticker(symbol)
            info = fund.info

            # Extraer información relevante
            fund_info = {
                'Nombre': info.get('longName', 'N/A'),
                'Símbolo': symbol,
                'Moneda': info.get('currency', 'N/A'),
                'Precio Actual': info.get('regularMarketPrice', info.get('navPrice', 'N/A')),
                'Precio Previo': info.get('previousClose', 'N/A'),
                'Cambio (%)': info.get('regularMarketChangePercent', 'N/A'),
                'Volumen': info.get('volume', 'N/A'),
                'Volumen Promedio': info.get('averageVolume', 'N/A'),
                'Rango 52 Semanas': f"{info.get('fiftyTwoWeekLow', 'N/A')} - {info.get('fiftyTwoWeekHigh', 'N/A')}",
                'Ratio de Gastos': info.get('annualReportExpenseRatio', 'N/A'),
                'Rendimiento YTD': info.get('ytdReturn', 'N/A'),
                'Rendimiento 3 Años': info.get('threeYearAverageReturn', 'N/A'),
                'Rendimiento 5 Años': info.get('fiveYearAverageReturn', 'N/A'),
                'Categoría': info.get('category', 'N/A'),
                'Familia': info.get('fundFamily', 'N/A'),
            }

            return fund_info

        except Exception as e:
            print(f"Error obteniendo información de {symbol}: {str(e)}")
            return None

    def get_custom_period_data(self, symbol: str, start_date: str, end_date: str) -> Optional[pd.DataFrame]:
        """
        Obtiene datos para un período personalizado

        Args:
            symbol: Símbolo del fondo
            start_date: Fecha de inicio (formato: 'YYYY-MM-DD')
            end_date: Fecha de fin (formato: 'YYYY-MM-DD')

        Returns:
            DataFrame con datos históricos o None si hay error
        """
        try:
            self.ticker = symbol
            fund = yf.Ticker(symbol)
            self.data = fund.history(start=start_date, end=end_date)

            if self.data.empty:
                return None

            return self.data

        except Exception as e:
            print(f"Error obteniendo datos personalizados de {symbol}: {str(e)}")
            return None

    def calculate_returns(self) -> Optional[Dict]:
        """
        Calcula rendimientos basados en los datos obtenidos

        Returns:
            Diccionario con diferentes métricas de rendimiento
        """
        if self.data is None or self.data.empty:
            return None

        try:
            initial_price = self.data['Close'].iloc[0]
            final_price = self.data['Close'].iloc[-1]

            # Rendimiento total
            total_return = ((final_price - initial_price) / initial_price) * 100

            # Volatilidad (desviación estándar de rendimientos diarios)
            daily_returns = self.data['Close'].pct_change()
            volatility = daily_returns.std() * 100

            # Máximo y mínimo
            max_price = self.data['Close'].max()
            min_price = self.data['Close'].min()

            # Drawdown máximo
            rolling_max = self.data['Close'].expanding().max()
            drawdown = ((self.data['Close'] - rolling_max) / rolling_max) * 100
            max_drawdown = drawdown.min()

            returns = {
                'Rendimiento Total (%)': round(total_return, 2),
                'Volatilidad Diaria (%)': round(volatility, 2),
                'Precio Máximo': round(max_price, 2),
                'Precio Mínimo': round(min_price, 2),
                'Drawdown Máximo (%)': round(max_drawdown, 2),
                'Precio Inicial': round(initial_price, 2),
                'Precio Final': round(final_price, 2),
            }

            return returns

        except Exception as e:
            print(f"Error calculando rendimientos: {str(e)}")
            return None

    def get_multiple_funds(self, symbols: List[str], period: str = "1y") -> Dict[str, pd.DataFrame]:
        """
        Obtiene datos de múltiples fondos

        Args:
            symbols: Lista de símbolos
            period: Período de tiempo

        Returns:
            Diccionario con DataFrames para cada símbolo
        """
        results = {}

        for symbol in symbols:
            data = self.get_fund_data(symbol, period)
            if data is not None:
                results[symbol] = data

        return results


# ============================================================================
# SCRAPERS - Investing.com
# ============================================================================

try:
    import requests
    from bs4 import BeautifulSoup
    INVESTING_AVAILABLE = True
except ImportError:
    INVESTING_AVAILABLE = False
    print("Advertencia: requests o beautifulsoup4 no están instalados. Investing.com no estará disponible.")


class InvestingScraper:
    """
    Clase para obtener datos de fondos de inversión desde Investing.com
    """

    def __init__(self):
        if not INVESTING_AVAILABLE:
            raise ImportError("requests y beautifulsoup4 son necesarios. Instálalos con: pip install requests beautifulsoup4")

        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def search_fund(self, fund_name: str) -> Optional[List[Dict]]:
        """
        Busca un fondo en Investing.com

        Args:
            fund_name: Nombre del fondo a buscar

        Returns:
            Lista de resultados encontrados o None si hay error
        """
        try:
            search_url = f"https://www.investing.com/search/?q={fund_name.replace(' ', '+')}"

            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            results = []
            search_results = soup.find_all('div', class_='js-inner-all-results-quote-item')

            for result in search_results[:5]:
                try:
                    name_elem = result.find('a', class_='js-search-result-title')
                    if name_elem:
                        name = name_elem.text.strip()
                        link = name_elem.get('href', '')

                        type_elem = result.find('span', class_='searchResultsSubCategory')
                        instrument_type = type_elem.text.strip() if type_elem else 'N/A'

                        results.append({
                            'Nombre': name,
                            'URL': f"https://www.investing.com{link}" if link.startswith('/') else link,
                            'Tipo': instrument_type
                        })
                except Exception as e:
                    continue

            return results if results else None

        except Exception as e:
            print(f"Error buscando fondo {fund_name}: {str(e)}")
            return None

    def get_fund_data(self, fund_url: str) -> Optional[Dict]:
        """
        Obtiene datos de un fondo específico desde su URL

        Args:
            fund_url: URL del fondo en Investing.com

        Returns:
            Diccionario con datos del fondo o None si hay error
        """
        try:
            response = self.session.get(fund_url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            fund_data = {}

            # Nombre del fondo
            name_elem = soup.find('h1', class_='text-2xl')
            if not name_elem:
                name_elem = soup.find('h1')
            fund_data['Nombre'] = name_elem.text.strip() if name_elem else 'N/A'

            # Precio actual
            price_elem = soup.find('div', {'data-test': 'instrument-price-last'})
            if price_elem:
                fund_data['Precio Actual'] = price_elem.text.strip()
            else:
                price_elem = soup.find('span', class_='text-5xl')
                fund_data['Precio Actual'] = price_elem.text.strip() if price_elem else 'N/A'

            # Cambio y porcentaje de cambio
            change_elem = soup.find('div', {'data-test': 'instrument-price-change'})
            if change_elem:
                fund_data['Cambio'] = change_elem.text.strip()

            change_pct_elem = soup.find('div', {'data-test': 'instrument-price-change-percent'})
            if change_pct_elem:
                fund_data['Cambio (%)'] = change_pct_elem.text.strip()

            # Buscar tabla de datos adicionales
            data_rows = soup.find_all('div', class_='grid grid-cols-2')

            for row in data_rows:
                try:
                    label = row.find('dt')
                    value = row.find('dd')

                    if label and value:
                        key = label.text.strip()
                        val = value.text.strip()
                        fund_data[key] = val
                except:
                    continue

            # Si no encontramos datos en ese formato, buscar tabla tradicional
            if len(fund_data) <= 3:
                table = soup.find('div', class_='overview-data-table')
                if table:
                    rows = table.find_all('div', class_='flex')
                    for row in rows:
                        try:
                            cols = row.find_all('span')
                            if len(cols) >= 2:
                                key = cols[0].text.strip()
                                val = cols[1].text.strip()
                                fund_data[key] = val
                        except:
                            continue

            fund_data['URL'] = fund_url
            fund_data['Fecha Consulta'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            return fund_data if len(fund_data) > 3 else None

        except Exception as e:
            print(f"Error obteniendo datos del fondo: {str(e)}")
            return None

    def get_fund_overview(self, fund_name: str) -> Optional[Dict]:
        """
        Busca un fondo y obtiene sus datos principales

        Args:
            fund_name: Nombre del fondo a buscar

        Returns:
            Diccionario con datos del fondo o None si hay error
        """
        search_results = self.search_fund(fund_name)

        if not search_results:
            return None

        first_result = search_results[0]
        fund_url = first_result['URL']

        time.sleep(1)

        fund_data = self.get_fund_data(fund_url)

        return fund_data


# ============================================================================
# INTERFAZ GRÁFICA
# ============================================================================

class MainWindow:
    """
    Ventana principal de la aplicación de fondos de inversión
    """

    def __init__(self, root):
        self.root = root
        self.root.title("Investment Fund Scraper - Analizador de Fondos de Inversión")
        self.root.geometry("1200x800")

        # Scrapers
        try:
            self.yahoo_scraper = YahooFinanceScraper() if YAHOO_AVAILABLE else None
        except:
            self.yahoo_scraper = None

        try:
            self.investing_scraper = InvestingScraper() if INVESTING_AVAILABLE else None
        except:
            self.investing_scraper = None

        # Variables
        self.current_data = None
        self.current_source = tk.StringVar(value="Yahoo Finance")

        # Verificar dependencias
        if not YAHOO_AVAILABLE and not INVESTING_AVAILABLE:
            messagebox.showerror("Error",
                "No hay scrapers disponibles.\n\n"
                "Instala las dependencias:\n"
                "pip install yfinance requests beautifulsoup4 pandas matplotlib")
            self.root.destroy()
            return

        # Crear interfaz
        self.create_widgets()

    def create_widgets(self):
        """Crea todos los widgets de la interfaz"""

        # Frame principal con pestañas
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Pestaña 1: Búsqueda y Análisis
        self.tab_search = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_search, text="Búsqueda y Análisis")
        self.create_search_tab()

        # Pestaña 2: Comparación de Fondos
        self.tab_compare = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_compare, text="Comparar Fondos")
        self.create_compare_tab()

        # Pestaña 3: Datos Históricos
        self.tab_historical = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_historical, text="Datos Históricos")
        self.create_historical_tab()

        # Barra de estado
        self.status_bar = tk.Label(self.root, text="Listo", bd=1, relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)

    def create_search_tab(self):
        """Crea la pestaña de búsqueda y análisis"""

        # Frame superior - Controles de búsqueda
        top_frame = ttk.Frame(self.tab_search)
        top_frame.pack(fill=tk.X, padx=10, pady=10)

        # Selección de fuente
        sources = []
        if YAHOO_AVAILABLE:
            sources.append("Yahoo Finance")
        if INVESTING_AVAILABLE:
            sources.append("Investing.com")

        ttk.Label(top_frame, text="Fuente de datos:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        source_combo = ttk.Combobox(top_frame, textvariable=self.current_source,
                                    values=sources,
                                    state="readonly", width=20)
        if sources:
            source_combo.current(0)
        source_combo.grid(row=0, column=1, padx=5, pady=5)

        # Campo de búsqueda
        ttk.Label(top_frame, text="Símbolo/Nombre del fondo:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.search_entry = ttk.Entry(top_frame, width=30)
        self.search_entry.grid(row=1, column=1, padx=5, pady=5)
        self.search_entry.bind('<Return>', lambda e: self.search_fund())

        # Botón de búsqueda
        ttk.Button(top_frame, text="Buscar", command=self.search_fund).grid(row=1, column=2, padx=5, pady=5)

        # Período de tiempo (solo para Yahoo Finance)
        ttk.Label(top_frame, text="Período:").grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
        self.period_var = tk.StringVar(value="1y")
        period_combo = ttk.Combobox(top_frame, textvariable=self.period_var,
                                    values=["1mo", "3mo", "6mo", "1y", "2y", "5y", "max"],
                                    state="readonly", width=20)
        period_combo.grid(row=2, column=1, padx=5, pady=5)

        # Frame del medio - Información del fondo
        info_frame = ttk.LabelFrame(self.tab_search, text="Información del Fondo")
        info_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Área de texto con scroll para mostrar información
        self.info_text = scrolledtext.ScrolledText(info_frame, height=15, width=60, wrap=tk.WORD)
        self.info_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)

        # Frame derecho para métricas
        metrics_frame = ttk.LabelFrame(info_frame, text="Métricas de Rendimiento")
        metrics_frame.pack(side=tk.RIGHT, fill=tk.BOTH, padx=5, pady=5)

        self.metrics_text = scrolledtext.ScrolledText(metrics_frame, height=15, width=40, wrap=tk.WORD)
        self.metrics_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        # Frame inferior - Gráfico
        graph_frame = ttk.LabelFrame(self.tab_search, text="Gráfico de Precios")
        graph_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Crear figura de matplotlib
        self.fig_search = Figure(figsize=(10, 4), dpi=100)
        self.ax_search = self.fig_search.add_subplot(111)
        self.canvas_search = FigureCanvasTkAgg(self.fig_search, master=graph_frame)
        self.canvas_search.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Botones de acción
        button_frame = ttk.Frame(self.tab_search)
        button_frame.pack(fill=tk.X, padx=10, pady=5)

        ttk.Button(button_frame, text="Exportar a CSV", command=self.export_csv).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Exportar a Excel", command=self.export_excel).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Guardar Gráfico", command=self.save_plot).pack(side=tk.LEFT, padx=5)

    def create_compare_tab(self):
        """Crea la pestaña de comparación de fondos"""

        # Frame superior
        top_frame = ttk.Frame(self.tab_compare)
        top_frame.pack(fill=tk.X, padx=10, pady=10)

        ttk.Label(top_frame, text="Comparar múltiples fondos (Yahoo Finance)").pack()
        ttk.Label(top_frame, text="Ingrese símbolos separados por comas (ej: SPY,QQQ,IWM)").pack()

        # Campo de entrada
        entry_frame = ttk.Frame(self.tab_compare)
        entry_frame.pack(fill=tk.X, padx=10, pady=5)

        ttk.Label(entry_frame, text="Símbolos:").pack(side=tk.LEFT, padx=5)
        self.compare_entry = ttk.Entry(entry_frame, width=50)
        self.compare_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)

        ttk.Button(entry_frame, text="Comparar", command=self.compare_funds).pack(side=tk.LEFT, padx=5)

        # Gráfico de comparación
        graph_frame = ttk.LabelFrame(self.tab_compare, text="Comparación de Rendimientos")
        graph_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.fig_compare = Figure(figsize=(10, 6), dpi=100)
        self.ax_compare = self.fig_compare.add_subplot(111)
        self.canvas_compare = FigureCanvasTkAgg(self.fig_compare, master=graph_frame)
        self.canvas_compare.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Tabla de resultados
        table_frame = ttk.LabelFrame(self.tab_compare, text="Resumen Comparativo")
        table_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.compare_text = scrolledtext.ScrolledText(table_frame, height=10, wrap=tk.WORD)
        self.compare_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

    def create_historical_tab(self):
        """Crea la pestaña de datos históricos personalizados"""

        # Frame de controles
        control_frame = ttk.Frame(self.tab_historical)
        control_frame.pack(fill=tk.X, padx=10, pady=10)

        ttk.Label(control_frame, text="Símbolo:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.hist_symbol_entry = ttk.Entry(control_frame, width=20)
        self.hist_symbol_entry.grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(control_frame, text="Fecha inicio (YYYY-MM-DD):").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.start_date_entry = ttk.Entry(control_frame, width=20)
        self.start_date_entry.grid(row=1, column=1, padx=5, pady=5)
        self.start_date_entry.insert(0, "2023-01-01")

        ttk.Label(control_frame, text="Fecha fin (YYYY-MM-DD):").grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
        self.end_date_entry = ttk.Entry(control_frame, width=20)
        self.end_date_entry.grid(row=2, column=1, padx=5, pady=5)
        self.end_date_entry.insert(0, datetime.now().strftime("%Y-%m-%d"))

        ttk.Button(control_frame, text="Obtener Datos", command=self.get_historical_data).grid(row=3, column=0, columnspan=2, pady=10)

        # Gráfico
        graph_frame = ttk.LabelFrame(self.tab_historical, text="Gráfico Histórico")
        graph_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.fig_hist = Figure(figsize=(10, 5), dpi=100)
        self.ax_hist = self.fig_hist.add_subplot(111)
        self.canvas_hist = FigureCanvasTkAgg(self.fig_hist, master=graph_frame)
        self.canvas_hist.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Estadísticas
        stats_frame = ttk.LabelFrame(self.tab_historical, text="Estadísticas del Período")
        stats_frame.pack(fill=tk.BOTH, padx=10, pady=10)

        self.hist_stats_text = scrolledtext.ScrolledText(stats_frame, height=8, wrap=tk.WORD)
        self.hist_stats_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

    def search_fund(self):
        """Busca y muestra información de un fondo"""
        symbol = self.search_entry.get().strip()
        if not symbol:
            messagebox.showwarning("Advertencia", "Por favor ingrese un símbolo o nombre de fondo")
            return

        self.status_bar.config(text=f"Buscando {symbol}...")
        self.root.update()

        source = self.current_source.get()

        try:
            if source == "Yahoo Finance":
                if not self.yahoo_scraper:
                    messagebox.showerror("Error", "Yahoo Finance no está disponible. Instala yfinance.")
                    return
                self.search_yahoo_fund(symbol)
            else:
                if not self.investing_scraper:
                    messagebox.showerror("Error", "Investing.com no está disponible. Instala requests y beautifulsoup4.")
                    return
                self.search_investing_fund(symbol)

            self.status_bar.config(text=f"Datos obtenidos de {symbol}")

        except Exception as e:
            messagebox.showerror("Error", f"Error al buscar el fondo: {str(e)}")
            self.status_bar.config(text="Error en la búsqueda")

    def search_yahoo_fund(self, symbol):
        """Busca un fondo en Yahoo Finance"""
        period = self.period_var.get()

        # Obtener información del fondo
        info = self.yahoo_scraper.get_fund_info(symbol)

        # Limpiar y mostrar información
        self.info_text.delete(1.0, tk.END)

        if info:
            for key, value in info.items():
                self.info_text.insert(tk.END, f"{key}: {value}\n")
        else:
            self.info_text.insert(tk.END, "No se pudo obtener información del fondo\n")

        # Obtener datos históricos
        data = self.yahoo_scraper.get_fund_data(symbol, period)

        if data is not None and not data.empty:
            self.current_data = data

            # Calcular métricas
            metrics = self.yahoo_scraper.calculate_returns()

            # Mostrar métricas
            self.metrics_text.delete(1.0, tk.END)
            if metrics:
                self.metrics_text.insert(tk.END, "MÉTRICAS DE RENDIMIENTO\n")
                self.metrics_text.insert(tk.END, "=" * 40 + "\n\n")
                for key, value in metrics.items():
                    self.metrics_text.insert(tk.END, f"{key}: {value}\n")

            # Crear gráfico
            self.plot_fund_data(data, symbol, self.ax_search, self.canvas_search)

        else:
            messagebox.showwarning("Advertencia", f"No se encontraron datos para {symbol}")

    def search_investing_fund(self, fund_name):
        """Busca un fondo en Investing.com"""
        data = self.investing_scraper.get_fund_overview(fund_name)

        self.info_text.delete(1.0, tk.END)

        if data:
            self.info_text.insert(tk.END, "INFORMACIÓN DEL FONDO (Investing.com)\n")
            self.info_text.insert(tk.END, "=" * 50 + "\n\n")

            for key, value in data.items():
                self.info_text.insert(tk.END, f"{key}: {value}\n")

            # Limpiar métricas
            self.metrics_text.delete(1.0, tk.END)
            self.metrics_text.insert(tk.END, "Nota: Las métricas de rendimiento\n")
            self.metrics_text.insert(tk.END, "están disponibles solo para\n")
            self.metrics_text.insert(tk.END, "Yahoo Finance.\n")

            # Limpiar gráfico
            self.ax_search.clear()
            self.ax_search.text(0.5, 0.5, 'Gráficos disponibles solo con Yahoo Finance',
                              ha='center', va='center', transform=self.ax_search.transAxes)
            self.canvas_search.draw()

        else:
            self.info_text.insert(tk.END, "No se encontraron datos para este fondo\n")

    def compare_funds(self):
        """Compara múltiples fondos"""
        if not self.yahoo_scraper:
            messagebox.showerror("Error", "Esta función requiere Yahoo Finance. Instala yfinance.")
            return

        symbols_text = self.compare_entry.get().strip()
        if not symbols_text:
            messagebox.showwarning("Advertencia", "Por favor ingrese símbolos para comparar")
            return

        symbols = [s.strip().upper() for s in symbols_text.split(',')]

        self.status_bar.config(text="Obteniendo datos de comparación...")
        self.root.update()

        try:
            period = "1y"
            all_data = self.yahoo_scraper.get_multiple_funds(symbols, period)

            if not all_data:
                messagebox.showwarning("Advertencia", "No se pudieron obtener datos de los fondos")
                return

            # Graficar comparación
            self.ax_compare.clear()

            for symbol, data in all_data.items():
                # Normalizar a 100 para comparar rendimientos relativos
                normalized = (data['Close'] / data['Close'].iloc[0]) * 100
                self.ax_compare.plot(normalized.index, normalized, label=symbol, linewidth=2)

            self.ax_compare.set_xlabel('Fecha')
            self.ax_compare.set_ylabel('Rendimiento Relativo (Base 100)')
            self.ax_compare.set_title('Comparación de Rendimientos')
            self.ax_compare.legend()
            self.ax_compare.grid(True, alpha=0.3)
            self.fig_compare.tight_layout()
            self.canvas_compare.draw()

            # Mostrar resumen
            self.compare_text.delete(1.0, tk.END)
            self.compare_text.insert(tk.END, "RESUMEN COMPARATIVO\n")
            self.compare_text.insert(tk.END, "=" * 60 + "\n\n")

            for symbol, data in all_data.items():
                initial = data['Close'].iloc[0]
                final = data['Close'].iloc[-1]
                ret = ((final - initial) / initial) * 100

                self.compare_text.insert(tk.END, f"{symbol}:\n")
                self.compare_text.insert(tk.END, f"  Precio inicial: ${initial:.2f}\n")
                self.compare_text.insert(tk.END, f"  Precio final: ${final:.2f}\n")
                self.compare_text.insert(tk.END, f"  Rendimiento: {ret:.2f}%\n\n")

            self.status_bar.config(text="Comparación completada")

        except Exception as e:
            messagebox.showerror("Error", f"Error en la comparación: {str(e)}")
            self.status_bar.config(text="Error en comparación")

    def get_historical_data(self):
        """Obtiene y muestra datos históricos personalizados"""
        if not self.yahoo_scraper:
            messagebox.showerror("Error", "Esta función requiere Yahoo Finance. Instala yfinance.")
            return

        symbol = self.hist_symbol_entry.get().strip().upper()
        start_date = self.start_date_entry.get().strip()
        end_date = self.end_date_entry.get().strip()

        if not symbol:
            messagebox.showwarning("Advertencia", "Por favor ingrese un símbolo")
            return

        self.status_bar.config(text=f"Obteniendo datos históricos de {symbol}...")
        self.root.update()

        try:
            data = self.yahoo_scraper.get_custom_period_data(symbol, start_date, end_date)

            if data is not None and not data.empty:
                # Graficar
                self.plot_fund_data(data, symbol, self.ax_hist, self.canvas_hist)

                # Calcular estadísticas
                self.hist_stats_text.delete(1.0, tk.END)

                stats = {
                    'Precio Máximo': data['Close'].max(),
                    'Precio Mínimo': data['Close'].min(),
                    'Precio Promedio': data['Close'].mean(),
                    'Volumen Promedio': data['Volume'].mean(),
                    'Desviación Estándar': data['Close'].std(),
                    'Rendimiento Total (%)': ((data['Close'].iloc[-1] - data['Close'].iloc[0]) / data['Close'].iloc[0]) * 100
                }

                self.hist_stats_text.insert(tk.END, f"ESTADÍSTICAS - {symbol}\n")
                self.hist_stats_text.insert(tk.END, f"Período: {start_date} a {end_date}\n")
                self.hist_stats_text.insert(tk.END, "=" * 50 + "\n\n")

                for key, value in stats.items():
                    if 'Volumen' in key:
                        self.hist_stats_text.insert(tk.END, f"{key}: {value:,.0f}\n")
                    else:
                        self.hist_stats_text.insert(tk.END, f"{key}: {value:.2f}\n")

                self.status_bar.config(text=f"Datos históricos obtenidos: {symbol}")

            else:
                messagebox.showwarning("Advertencia", "No se encontraron datos para el período especificado")

        except Exception as e:
            messagebox.showerror("Error", f"Error al obtener datos históricos: {str(e)}")
            self.status_bar.config(text="Error obteniendo datos históricos")

    def plot_fund_data(self, data, symbol, ax, canvas):
        """Grafica los datos del fondo"""
        ax.clear()

        # Gráfico de línea
        ax.plot(data.index, data['Close'], label='Precio de Cierre', linewidth=2, color='blue')

        # Añadir volumen en eje secundario
        ax2 = ax.twinx()
        ax2.bar(data.index, data['Volume'], alpha=0.3, color='gray', label='Volumen')
        ax2.set_ylabel('Volumen', color='gray')

        ax.set_xlabel('Fecha')
        ax.set_ylabel('Precio ($)', color='blue')
        ax.set_title(f'{symbol} - Precio Histórico')
        ax.grid(True, alpha=0.3)
        ax.legend(loc='upper left')

        # Rotar etiquetas de fecha
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45)

        canvas.figure.tight_layout()
        canvas.draw()

    def export_csv(self):
        """Exporta los datos actuales a CSV"""
        if self.current_data is None or self.current_data.empty:
            messagebox.showwarning("Advertencia", "No hay datos para exportar")
            return

        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if filename:
            try:
                self.current_data.to_csv(filename)
                messagebox.showinfo("Éxito", f"Datos exportados a {filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Error al exportar: {str(e)}")

    def export_excel(self):
        """Exporta los datos actuales a Excel"""
        if self.current_data is None or self.current_data.empty:
            messagebox.showwarning("Advertencia", "No hay datos para exportar")
            return

        filename = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")]
        )

        if filename:
            try:
                self.current_data.to_excel(filename, engine='openpyxl')
                messagebox.showinfo("Éxito", f"Datos exportados a {filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Error al exportar: {str(e)}")

    def save_plot(self):
        """Guarda el gráfico actual"""
        filename = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=[("PNG files", "*.png"), ("PDF files", "*.pdf"), ("All files", "*.*")]
        )

        if filename:
            try:
                current_tab = self.notebook.index(self.notebook.select())

                if current_tab == 0:
                    self.fig_search.savefig(filename, dpi=300, bbox_inches='tight')
                elif current_tab == 1:
                    self.fig_compare.savefig(filename, dpi=300, bbox_inches='tight')
                else:
                    self.fig_hist.savefig(filename, dpi=300, bbox_inches='tight')

                messagebox.showinfo("Éxito", f"Gráfico guardado en {filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Error al guardar gráfico: {str(e)}")


# ============================================================================
# FUNCIÓN PRINCIPAL
# ============================================================================

def main():
    """Función principal para ejecutar la aplicación"""

    # Verificar dependencias críticas
    missing_deps = []

    if not YAHOO_AVAILABLE:
        missing_deps.append("yfinance")
    if not INVESTING_AVAILABLE:
        missing_deps.append("requests beautifulsoup4")

    try:
        import pandas
    except ImportError:
        missing_deps.append("pandas")

    try:
        import matplotlib
    except ImportError:
        missing_deps.append("matplotlib")

    if missing_deps:
        print("\n" + "="*60)
        print("ADVERTENCIA: Faltan dependencias")
        print("="*60)
        print("\nPara usar todas las funciones, instala:")
        print(f"pip install {' '.join(missing_deps)}")
        print("\nLa aplicación se iniciará con funcionalidad limitada.")
        print("="*60 + "\n")

    root = tk.Tk()
    app = MainWindow(root)

    # Instrucciones en la consola
    print("\n" + "="*60)
    print("Investment Fund Scraper - Aplicación Iniciada")
    print("="*60)
    print("\nEjemplos de símbolos populares (Yahoo Finance):")
    print("  SPY   - SPDR S&P 500 ETF Trust")
    print("  QQQ   - Invesco QQQ Trust (NASDAQ-100)")
    print("  IWM   - iShares Russell 2000 ETF")
    print("  VFIAX - Vanguard 500 Index Fund")
    print("  VTI   - Vanguard Total Stock Market ETF")
    print("\nPara usar Investing.com, busca por nombre del fondo.")
    print("="*60 + "\n")

    root.mainloop()


if __name__ == "__main__":
    main()
