#!/usr/bin/env python3
"""
Ejemplos de uso de los scrapers sin interfaz gráfica
Útil para pruebas y automatización
"""

from src.scrapers.yahoo_finance_scraper import YahooFinanceScraper
from src.scrapers.investing_scraper import InvestingScraper


def example_yahoo_finance():
    """Ejemplo de uso del scraper de Yahoo Finance"""
    print("=" * 60)
    print("EJEMPLO: Yahoo Finance Scraper")
    print("=" * 60)

    scraper = YahooFinanceScraper()

    # Ejemplo 1: Obtener información de un fondo
    print("\n1. Información del fondo SPY:")
    print("-" * 60)
    info = scraper.get_fund_info('SPY')
    if info:
        for key, value in info.items():
            print(f"{key}: {value}")

    # Ejemplo 2: Obtener datos históricos
    print("\n2. Datos históricos del último año:")
    print("-" * 60)
    data = scraper.get_fund_data('SPY', period='1y')
    if data is not None:
        print(data.head())
        print(f"\nTotal de registros: {len(data)}")

    # Ejemplo 3: Calcular rendimientos
    print("\n3. Métricas de rendimiento:")
    print("-" * 60)
    metrics = scraper.calculate_returns()
    if metrics:
        for key, value in metrics.items():
            print(f"{key}: {value}")

    # Ejemplo 4: Comparar múltiples fondos
    print("\n4. Comparar múltiples fondos:")
    print("-" * 60)
    symbols = ['SPY', 'QQQ', 'IWM']
    all_data = scraper.get_multiple_funds(symbols, period='6mo')

    for symbol, data in all_data.items():
        initial = data['Close'].iloc[0]
        final = data['Close'].iloc[-1]
        ret = ((final - initial) / initial) * 100
        print(f"{symbol}: Rendimiento = {ret:.2f}%")


def example_investing():
    """Ejemplo de uso del scraper de Investing.com"""
    print("\n\n" + "=" * 60)
    print("EJEMPLO: Investing.com Scraper")
    print("=" * 60)

    scraper = InvestingScraper()

    # Ejemplo 1: Buscar un fondo
    print("\n1. Buscar 'Vanguard':")
    print("-" * 60)
    results = scraper.search_fund('Vanguard')
    if results:
        for i, result in enumerate(results, 1):
            print(f"\nResultado {i}:")
            print(f"  Nombre: {result['Nombre']}")
            print(f"  Tipo: {result['Tipo']}")
            print(f"  URL: {result['URL']}")

    # Ejemplo 2: Obtener información completa de un fondo
    print("\n2. Información completa del primer resultado:")
    print("-" * 60)
    if results:
        fund_data = scraper.get_fund_data(results[0]['URL'])
        if fund_data:
            for key, value in fund_data.items():
                print(f"{key}: {value}")


def example_custom_period():
    """Ejemplo de análisis de período personalizado"""
    print("\n\n" + "=" * 60)
    print("EJEMPLO: Análisis de Período Personalizado")
    print("=" * 60)

    scraper = YahooFinanceScraper()

    print("\nAnálisis de SPY desde 2023-01-01 hasta 2024-01-01:")
    print("-" * 60)

    data = scraper.get_custom_period_data('SPY', '2023-01-01', '2024-01-01')

    if data is not None:
        print(f"Registros obtenidos: {len(data)}")
        print(f"Fecha inicial: {data.index[0]}")
        print(f"Fecha final: {data.index[-1]}")
        print(f"Precio inicial: ${data['Close'].iloc[0]:.2f}")
        print(f"Precio final: ${data['Close'].iloc[-1]:.2f}")

        metrics = scraper.calculate_returns()
        if metrics:
            print("\nMétricas:")
            for key, value in metrics.items():
                print(f"  {key}: {value}")


def main():
    """Ejecuta todos los ejemplos"""
    print("\n" + "=" * 60)
    print("EJEMPLOS DE USO - INVESTMENT FUND SCRAPER")
    print("=" * 60)

    try:
        # Yahoo Finance
        example_yahoo_finance()

        # Investing.com (comentado por defecto para evitar scraping excesivo)
        # Descomenta la siguiente línea si deseas probar Investing.com
        # example_investing()

        # Período personalizado
        example_custom_period()

    except Exception as e:
        print(f"\nError durante la ejecución: {str(e)}")

    print("\n" + "=" * 60)
    print("EJEMPLOS COMPLETADOS")
    print("=" * 60)


if __name__ == "__main__":
    main()
