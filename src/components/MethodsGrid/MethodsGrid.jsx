import Card from "../Card/Card";
import styles from "./MethodsGrid.module.css";

const items = [
  {
    id: "cuadrados",
    title: "Juego del dado",
    text:
      "el apostador lanza 2 dados y si saca 7 en la suma de los dos dados gana caso contrario pierde, costo del juego es de 2 Bs. y la perdida de la casa si el jugador gana es de 5 Bs., simule el juego para 10 lanzamientos y determine la ganancia neta de la casa, el numero de juegos que gana la casa, el porcentaje de juegos que gana la casa. Conviene implementar este juego de azar?"
  },
  {
    id: "productos",
    title: "Agencia de azúcar",
    text:
      "La demanda de azúcar en una tienda sigue una distribución exponencial con media de 100 Kg/día. El dueño de la tienda revisa el inventario cada 7 días y hace un pedido a la planta igual a la capacidad de la bodega menos la cantidad de azúcar que tiene disponible en ese momento: la entrega no es inmediata y sigue una distribución uniforme entre 1 y 3 días. La demanda no surtida por falta de existencias representa ventas perdidas. La capacidad de almacenamiento de la bodega es de 700 Kgrs. El costo de ordenar es de 100 Bs./orden. El costo de llevar el inventario es igual a 0.1 Bs./Kg, el costo de adquisición es igual a 3.5 Bs/Kgr y el precio de venta igual 5 Bs/Kgr. Determinar el comportamiento del inventario a lo largo del tiempo, el costo y la ganancia neta, la demanda insatisfecha para un horizonte de dos meses. Sera la capacidad del almacén suficiente? Bs./Kg, el costo de adquisición es igual a 3.5 Bs/Kgr y el precio de venta igual 5 Bs/Kgr. Determinar el comportamiento del inventario a lo largo del tiempo, el costo y la ganancia neta, la demanda insatisfecha para un horizonte de dos meses. Sera lacapacidad del almacén suficiente?"
  },
  {
    id: "lineal",
    title: "Llegada de clientes a tienda",
    text:
      "Las llegadas de los clientes a una tienda, sigue una distribución uniforme: 2 ± 2, por hora y cada cliente compra artículos de acuerdo con una función de probabilidad basada en los articulos. Mediante el desarrollo de un modelo de simulación, determine la ganancia neta del dueño y la cantidad de artículos vendidos de ese día si sus costos por día asciende a 300 Bs y el costo del articulo es igual A 50 Bs y el precio de venta es igual a 75 Bs."
  },
  {
    id: "multiplicativo",
    title: "Gallina ponedora de huevos",
    text:
      "Un granjero tiene una gallina que pone huevos a una razón Poisson con media de 1 huevos por día. El 20% de los huevos se rompen, del 30% de ellos nacen pollos y el resto permanecen como huevos. De los pollos el 20% muere y el 80% sobreviven. Simule este sistema por cierta cantidad de días y determine el ingreso promedio del granjero tomando en cuenta ciertos precios por los huevos y por los pollos"
  }
];

export default function MethodsGrid() {
  return (
    <section className="container" id="inicio" aria-label="Métodos de generación">
      <h1 className="section-title">Implementacion Diagramas de Flujo</h1>
      <p className="section-subtitle">
        Una herramienta esencial para definir la estructura lógica del modelo de simulación es
        el diagrama de flujo, el cual ayuda a entender la lógica del sistema bajo estudio, también ilustra el rol que
        tienen las entradas y las salidas del modelo.
      </p>

      <div className={styles.grid}>
        {items.map((it) => (
          <Card key={it.id} title={it.title} onClick={() => console.log(it.id)}>
            {it.text}
          </Card>
        ))}
      </div>
    </section>
  );
}
