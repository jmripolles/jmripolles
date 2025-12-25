"""
Scraper para Investing.com
"""
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from typing import Dict, List, Optional
import time
import re


class InvestingScraper:
    """
    Clase para obtener datos de fondos de inversión desde Investing.com
    """

    def __init__(self):
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
            # URL de búsqueda de Investing.com
            search_url = f"https://www.investing.com/search/?q={fund_name.replace(' ', '+')}"

            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Buscar resultados de fondos
            results = []
            search_results = soup.find_all('div', class_='js-inner-all-results-quote-item')

            for result in search_results[:5]:  # Limitar a 5 resultados
                try:
                    name_elem = result.find('a', class_='js-search-result-title')
                    if name_elem:
                        name = name_elem.text.strip()
                        link = name_elem.get('href', '')

                        # Extraer tipo de instrumento
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
                # Intentar otro selector
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

    def get_historical_data(self, fund_url: str) -> Optional[pd.DataFrame]:
        """
        Intenta obtener datos históricos del fondo

        Args:
            fund_url: URL del fondo en Investing.com

        Returns:
            DataFrame con datos históricos o None si no está disponible
        """
        try:
            # Construir URL de datos históricos
            if not fund_url.endswith('-historical-data'):
                historical_url = fund_url.rstrip('/') + '-historical-data'
            else:
                historical_url = fund_url

            response = self.session.get(historical_url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Buscar tabla de datos históricos
            table = soup.find('table', {'data-test': 'historical-data-table'})

            if not table:
                # Intentar selector alternativo
                table = soup.find('table', class_='freeze-column-w-1')

            if table:
                # Extraer datos de la tabla
                headers = []
                header_row = table.find('thead')
                if header_row:
                    headers = [th.text.strip() for th in header_row.find_all('th')]

                rows_data = []
                tbody = table.find('tbody')
                if tbody:
                    rows = tbody.find_all('tr')
                    for row in rows:
                        cols = row.find_all('td')
                        row_data = [col.text.strip() for col in cols]
                        if row_data:
                            rows_data.append(row_data)

                if headers and rows_data:
                    df = pd.DataFrame(rows_data, columns=headers)
                    return df

            return None

        except Exception as e:
            print(f"Error obteniendo datos históricos: {str(e)}")
            return None

    def get_fund_overview(self, fund_name: str) -> Optional[Dict]:
        """
        Busca un fondo y obtiene sus datos principales

        Args:
            fund_name: Nombre del fondo a buscar

        Returns:
            Diccionario con datos del fondo o None si hay error
        """
        # Primero buscar el fondo
        search_results = self.search_fund(fund_name)

        if not search_results:
            return None

        # Tomar el primer resultado
        first_result = search_results[0]
        fund_url = first_result['URL']

        # Pequeña pausa para no sobrecargar el servidor
        time.sleep(1)

        # Obtener datos del fondo
        fund_data = self.get_fund_data(fund_url)

        return fund_data

    def compare_funds(self, fund_names: List[str]) -> Dict[str, Dict]:
        """
        Compara múltiples fondos

        Args:
            fund_names: Lista de nombres de fondos

        Returns:
            Diccionario con datos de cada fondo
        """
        results = {}

        for fund_name in fund_names:
            try:
                fund_data = self.get_fund_overview(fund_name)
                if fund_data:
                    results[fund_name] = fund_data

                # Pausa entre consultas
                time.sleep(2)

            except Exception as e:
                print(f"Error obteniendo datos de {fund_name}: {str(e)}")
                continue

        return results
