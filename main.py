#!/usr/bin/env python3
"""
Investment Fund Scraper - Aplicación principal
Aplicación gráfica para obtener y analizar datos de fondos de inversión
desde Yahoo Finance e Investing.com
"""

import tkinter as tk
from src.gui.main_window import MainWindow


def main():
    """Función principal"""
    root = tk.Tk()
    app = MainWindow(root)
    root.mainloop()


if __name__ == "__main__":
    main()
