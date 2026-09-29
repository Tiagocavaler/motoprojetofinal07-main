// @ts-nocheck // 1. Desliga TS - leaflet sem tipagem
"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet"; // 3. Lib mapa
import "leaflet/dist/leaflet.css"; // 4. CSS obrigatório

export default function MapClient({ filtros, busca }) { // 5. filtros = { boss: true, caverna: false } busca = string
  const mapRef = useRef(null); // 6. Div onde o mapa vai montar
  const map = useRef(null); // 7. Instância L.map - ref pra não recriar
  const layer = useRef(null); // 8. layerGroup onde ficam os markers - pra limpar sem apagar mapa base
  const [markers, setMarkers] = useState([]); // 9. Lista crua do json

  useEffect(() => { // 10. Carrega markers uma vez
    fetch("/map-data/markers-1.0.json").then(r=>r.json()).then(setMarkers).catch(()=>{}); // 11. public/map-data/ - catch vazio se não existir
  }, []);

  useEffect(() => { // 12. Inicia mapa uma vez
    if (!mapRef.current || map.current) return; // 13. Só se div existe e mapa ainda não criado
    map.current = L.map(mapRef.current, {crs:L.CRS.Simple,minZoom:-2,maxZoom:2,center:[500,500],zoom:0,zoomControl:false}); // 14. CRS.Simple = plano cartesiano, não lat/lng - pra mapa de jogo
    const bounds = [[0,0],[1000,1000]]; // 15. Tamanho virtual do mapa
    // 16. tenta carregar imagem oficial, se não tiver usa fundo escuro - fallback
    L.imageOverlay("/map/palworld-official.jpg", bounds).addTo(map.current).on('error',()=>{
      L.rectangle(bounds,{color:"#0b1620",fillColor:"#0b1620",fillOpacity:1,weight:0}).addTo(map.current);
    });
    map.current.fitBounds(bounds); // 17. Zoom pra caber tudo
    layer.current = L.layerGroup().addTo(map.current); // 18. Grupo pra markers
  }, []);

  useEffect(() => { // 19. Redesenha markers quando filtro/busca muda
    if (!layer.current) return;
    layer.current.clearLayers(); // 20. Limpa antigos
    let list = markers.filter(m=>filtros[m.type]); // 21. Só tipos ligados
    if(busca) list = list.filter(m=>m.name.toLowerCase().includes(busca.toLowerCase())); // 22. Busca por nome
    list.forEach(m=>{ // 23. Cria pin
      const icon = L.divIcon({html:`<div style="background:${m.color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px ${m.color}"></div>`,iconSize:[12,12],iconAnchor:[6,6],className:""}); // 24. Bolinha colorida divIcon - sem imagem
      L.marker([m.y,m.x],{icon}).addTo(layer.current).bindPopup(`<b>${m.name}</b><br/>${m.level||''}`); // 25. [y,x] pq CRS.Simple - popup com nome/level
    });
  }, [markers,filtros,busca]);

  return <div ref={mapRef} style={{width:"100%",height:"100%",background:"#061018"}} />; // 26. Container do leaflet - 100% do pai
}