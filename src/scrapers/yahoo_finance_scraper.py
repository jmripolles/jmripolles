"""
Scraper para Yahoo Finance usando yfinance
"""
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional


class YahooFinanceScraper:
    """
    Clase para obtener datos de fondos de inversión desde Yahoo Finance
    """

    def __init__(self):
        self.data = None
        self.ticker = None

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
