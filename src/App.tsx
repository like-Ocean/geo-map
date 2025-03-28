import { useState, useMemo } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import { PolygonLayer } from '@deck.gl/layers';
import { Map } from '@vis.gl/react-maplibre';
import { NavigationControl } from '@vis.gl/react-maplibre';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: 105,
  latitude: 60,
  zoom: 3.5,
  pitch: 0,
  bearing: 0
};

type GridCell = {
  polygon: number[][];
  id: string;
  value: number;
};

function generateHexagonGrid(
  columns: number,
  rows: number,
  center: [number, number],
  cellRadius: number
): GridCell[] {
  const grid: GridCell[] = [];
  const sqrt3 = Math.sqrt(3);
  const horizontalSpacing = cellRadius * sqrt3;
  const verticalSpacing = cellRadius * 1.5;

  const gridWidth =
    columns > 1 ? horizontalSpacing * (columns - 1) + cellRadius * 2 : cellRadius * 2;
  const gridHeight =
    rows > 1 ? verticalSpacing * (rows - 1) + cellRadius * 2 : cellRadius * 2;
  const startX = center[0] - gridWidth / 2;
  const startY = center[1] - gridHeight / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const offsetX = (row % 2) * (horizontalSpacing / 2);
      const cx = startX + col * horizontalSpacing + offsetX + cellRadius;
      const cy = startY + row * verticalSpacing + cellRadius;
      const polygon: number[][] = [];
      
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        const x = cx + cellRadius * Math.cos(angle);
        const y = cy + cellRadius * Math.sin(angle);
        polygon.push([x, y]);
      }
      
      grid.push({
        polygon,
        id: `${row}-${col}`,
        value: 0
      });
    }
  }
  return grid;
}

export const App = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [columns, setColumns] = useState<number>(10);
  const [rows, setRows] = useState<number>(10);
  const [cellRadius, setCellRadius] = useState<number>(0.5);
  const [gridData, setGridData] = useState<GridCell[]>([]);

  const handleGenerateGrid = () => {
    const center: [number, number] = [viewState.longitude, viewState.latitude];
    const grid = generateHexagonGrid(columns, rows, center, cellRadius);
    setGridData(grid);
  };

  const polygonLayer = useMemo(() => {
    return new PolygonLayer<GridCell>({
      id: 'grid-layer',
      data: gridData,
      pickable: true,
      stroked: true,
      filled: true,
      getPolygon: (d) => d.polygon,
      getFillColor: (d) => [255, 165, 0, 150],
      getLineColor: [0, 0, 0],
      lineWidthMinPixels: 1
    });
  }, [gridData]);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={[polygonLayer]}
        onViewStateChange={(evt) => {
          setViewState(evt.viewState as typeof INITIAL_VIEW_STATE);
        }}
      >
        <Map
          reuseMaps
          mapStyle={MAP_STYLE}
        >
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <NavigationControl />
          </div>
        </Map>
      </DeckGL>
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 10,
          background: 'white',
          padding: '10px',
          borderRadius: '4px',
          zIndex: 1
        }}
      >
        <div>
          <label>
            Количество столбцов:&nbsp;
            <input
              type="number"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
        <div>
          <label>
            Количество строк:&nbsp;
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
        <div>
          <label>
            Радиус ячейки (°):&nbsp;
            <input
              type="number"
              step="0.1"
              value={cellRadius}
              onChange={(e) => setCellRadius(parseFloat(e.target.value) || 0)}
            />
          </label>
        </div>
        <button onClick={handleGenerateGrid} style={{ marginTop: '10px' }}>
          Построить сетку
        </button>
      </div>
    </div>
  );
};

export default App;
