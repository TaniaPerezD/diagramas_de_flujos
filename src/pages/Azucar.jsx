import React, { useState } from 'react';
import '../styles/simulacion.css';

// ======= FUNCIONES AUXILIARES =======
function expRand(mean) {
  const u = Math.random();
  return -Math.log(1 - u) * mean;
}

function uniformRand(a, b) {
  return a + (b - a) * Math.random();
}

// ======= FUNCIÓN PRINCIPAL =======
function simularInventario({
  horizonDays = 27,
  capacity = 700,
  meanDemand = 100,
  orderCost = 100,
  carryCostPerKgDay = 0.1,
  unitAcqCost = 3.5,
  unitSellPrice = 5.0,
  initialInventory = capacity,
}) {
  const reviewPeriod = 7;
  const leadMin = 1;
  const leadMax = 3;

  let CD = 0;
  let IAZU = initialInventory;
  let PAZU = 0;
  let TENT = "-";
  let pendingOrders = [];

  let CTORD = 0;
  let CTADQ = 0;
  let CTINV = 0;
  let CTOT = 0;

  let totalDemand = 0;
  let totalSold = 0;
  let totalLost = 0;
  let revenue = 0;

  const tabla = [];

  for (CD = 1; CD <= horizonDays; CD++) {
    // Llegadas de pedidos
    for (let i = pendingOrders.length - 1; i >= 0; i--) {
      if (pendingOrders[i].arrivalDay <= CD) {
        const qty = pendingOrders[i].qty;
        IAZU = Math.min(IAZU + qty, capacity);
        pendingOrders.splice(i, 1);
      }
    }

    PAZU = 0;
    if (CD % reviewPeriod === 0) {
      const orderQty = Math.max(0, capacity - IAZU);
      if (orderQty > 0) {
        PAZU = orderQty;
        let lead = Math.round(uniformRand(leadMin, leadMax));
        lead = Math.min(3, Math.max(1, lead));
        const arrivalDay = CD + lead;
        pendingOrders.push({ qty: orderQty, arrivalDay });
        TENT = lead;

        CTORD += orderCost;
        CTADQ += orderQty * unitAcqCost;
      }
    } else {
      if (pendingOrders.length > 0) {
        const next = Math.min(...pendingOrders.map(o => o.arrivalDay - CD));
        TENT = Math.max(0, next);
      } else {
        TENT = Infinity;
      }
    }

    const DAZU = Math.round(expRand(meanDemand));
    totalDemand += DAZU;
    const sold = Math.min(IAZU, DAZU);
    const lost = Math.max(0, DAZU - sold);
    totalSold += sold;
    totalLost += lost;
    revenue += sold * unitSellPrice;
    IAZU -= sold;

    CTINV += IAZU * carryCostPerKgDay;
    CTOT = CTORD + CTADQ + CTINV;

    tabla.push({
      Día: CD,
      Inventario: IAZU.toFixed(2),
      Demanda: DAZU.toFixed(2),
      Pedido: PAZU.toFixed(2),
      TiempoEntrega: isFinite(TENT) ? TENT.toFixed(0) : "-",
      CostoOrden: CTORD.toFixed(2),
      CostoAdquisicion: CTADQ.toFixed(2),
      CostoInventario: CTINV.toFixed(2),
      CostoTotal: CTOT.toFixed(2),
      PerdidaAcumulada: totalLost.toFixed(2),
    });
  }

  return {
    tabla,
    resultados: {
      DemandaTotal: totalDemand,
      TotalVendido: totalSold,
      DemandaInsatisfecha: totalLost,
      CostoTotal: CTOT,
      Ingresos: revenue,
      GananciaNeta: revenue - CTOT,
      NivelServicio: (totalSold / totalDemand) * 100,
    },
  };
}

export default function SimulacionEventos() {
  const [numSimulaciones, setNumSimulaciones] = useState(10);
  const [horizonDays, setHorizonDays] = useState(27);
  const [capacity, setCapacity] = useState(700);
  const [meanDemand, setMeanDemand] = useState(100);
  const [orderCost, setOrderCost] = useState(100);
  const [carryCostPerKgDay, setCarryCostPerKgDay] = useState(0.1);
  const [unitAcqCost, setUnitAcqCost] = useState(3.5);
  const [unitSellPrice, setUnitSellPrice] = useState(5.0);
  const [initialInventory, setInitialInventory] = useState(700);

  const [resultadosPromedio, setResultadosPromedio] = useState(null);
  const [resultados, setResultados] = useState([]);

  const ejecutarSimulacion = () => {
    let acumulado = {
      DemandaTotal: 0,
      TotalVendido: 0,
      DemandaInsatisfecha: 0,
      CostoTotal: 0,
      Ingresos: 0,
      GananciaNeta: 0,
      NivelServicio: 0,
    };

    const listaResultados = [];

    for (let i = 0; i < numSimulaciones; i++) {
      const salida = simularInventario({
        horizonDays,
        capacity,
        meanDemand,
        orderCost,
        carryCostPerKgDay,
        unitAcqCost,
        unitSellPrice,
        initialInventory,
      });

      const r = salida.resultados;
      listaResultados.push({
        num: i + 1,
        gananciaNeta: parseFloat(r.GananciaNeta),
        costoTotal: parseFloat(r.CostoTotal),
        ingresos: parseFloat(r.Ingresos),
        demandaTotal: parseFloat(r.DemandaTotal),
        totalVendido: parseFloat(r.TotalVendido),
        demandaInsatisfecha: parseFloat(r.DemandaInsatisfecha),
        nivelServicio:
          typeof r.NivelServicio === 'string'
            ? parseFloat(r.NivelServicio.replace('%', ''))
            : parseFloat(r.NivelServicio),
      });

      acumulado.DemandaTotal += parseFloat(r.DemandaTotal);
      acumulado.TotalVendido += parseFloat(r.TotalVendido);
      acumulado.DemandaInsatisfecha += parseFloat(r.DemandaInsatisfecha);
      acumulado.CostoTotal += parseFloat(r.CostoTotal);
      acumulado.Ingresos += parseFloat(r.Ingresos);
      acumulado.GananciaNeta += parseFloat(r.GananciaNeta);
      acumulado.NivelServicio += parseFloat(
  typeof r.NivelServicio === "string"
    ? r.NivelServicio.replace('%', '')
    : r.NivelServicio
);

    }

    const promedio = {
      DemandaTotal: (acumulado.DemandaTotal / numSimulaciones).toFixed(2),
      TotalVendido: (acumulado.TotalVendido / numSimulaciones).toFixed(2),
      DemandaInsatisfecha: (acumulado.DemandaInsatisfecha / numSimulaciones).toFixed(2),
      CostoTotal: (acumulado.CostoTotal / numSimulaciones).toFixed(2),
      Ingresos: (acumulado.Ingresos / numSimulaciones).toFixed(2),
      GananciaNeta: (acumulado.GananciaNeta / numSimulaciones).toFixed(2),
      NivelServicio: ((acumulado.NivelServicio / numSimulaciones).toFixed(2)) + "%",
    };

    setResultados(listaResultados);
    setResultadosPromedio(promedio);
  };

  const limpiarResultados = () => {
    setResultados([]);
    setResultadosPromedio(null);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Simulación de Inventario de Azúcar</h1>
      </header>

      <div className="content">
        <div className="problema-section">
          <div className="columnas">
            {/* Columna Izquierda */}
            <div className="columna-izquierda">
              <div className="card">
                <h3>Configuración</h3>

                <div className="input-group">
                  <label>Número de simulaciones:</label>
                  <input
                    type="number"
                    min="1"
                    value={numSimulaciones}
                    onChange={(e) => setNumSimulaciones(Number(e.target.value) || 1)}
                  />
                </div>

                <div className="input-group">
                  <label>Días del horizonte:</label>
                  <input
                    type="number"
                    min="1"
                    value={horizonDays}
                    onChange={(e) => setHorizonDays(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="input-group">
                  <label>Capacidad (kg):</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label>Demanda media:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={meanDemand}
                    onChange={(e) => setMeanDemand(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label>Costo de orden:</label>
                  <input
                    type="number"
                    value={orderCost}
                    onChange={(e) => setOrderCost(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label>Costo inventario (por kg/día):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={carryCostPerKgDay}
                    onChange={(e) => setCarryCostPerKgDay(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label>Costo adquisición/unidad:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitAcqCost}
                    onChange={(e) => setUnitAcqCost(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label>Precio venta/unidad:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitSellPrice}
                    onChange={(e) => setUnitSellPrice(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label>Inventario inicial:</label>
                  <input
                    type="number"
                    value={initialInventory}
                    onChange={(e) => setInitialInventory(Number(e.target.value) || 0)}
                  />
                </div>

                <button onClick={ejecutarSimulacion} className="btn-simular">
                  Simular
                </button>
                <button onClick={limpiarResultados} className="btn-simular btn-secundario">
                  Limpiar
                </button>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="columna-derecha">
              <div className="card">
                <h3>Resultados de las Simulaciones</h3>
                <p className="descripcion-tabla">
                  <strong>Descripción de columnas:</strong> GNETA muestra la ganancia neta por simulación; CTOT es el costo total; INGRESOS representa las ventas totales; DTOT indica la demanda total; VEND son las unidades vendidas; INSAT muestra la demanda no satisfecha; y NSERV (%) refleja el nivel de servicio alcanzado.
                </p>
                <div className="tabla-container">
                  <table className="tabla-resultados">
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th>GNETA (Bs)</th>
                        <th>CTOT (Bs)</th>
                        <th>INGRESOS (Bs)</th>
                        <th>DTOT</th>
                        <th>VEND</th>
                        <th>INSAT</th>
                        <th>NSERV (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="sin-datos">Ejecuta la simulación para ver los resultados</td>
                        </tr>
                      ) : (
                        resultados.map((r) => (
                          <tr key={r.num}>
                            <td>{r.num}</td>
                            <td>{r.gananciaNeta.toFixed(2)}</td>
                            <td>{r.costoTotal.toFixed(2)}</td>
                            <td>{r.ingresos.toFixed(2)}</td>
                            <td>{r.demandaTotal}</td>
                            <td>{r.totalVendido}</td>
                            <td>{r.demandaInsatisfecha}</td>
                            <td>{r.nivelServicio.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {resultadosPromedio && (
                  <div className="estadisticas">
                    <h4>Promedio de Resultados</h4>
                    <div className="estadisticas-grid">
                      <div className="stat-item">
                        <span className="stat-label">GNETA Promedio:</span>
                        <span className="stat-value">{resultadosPromedio.GananciaNeta} Bs</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">CTOT Promedio:</span>
                        <span className="stat-value">{resultadosPromedio.CostoTotal} Bs</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Ingresos Promedio:</span>
                        <span className="stat-value">{resultadosPromedio.Ingresos} Bs</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Nivel Servicio Promedio:</span>
                        <span className="stat-value">{resultadosPromedio.NivelServicio}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
