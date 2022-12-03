import type View from "ol/View";
import type MapInstance from "ol/Map";
import Layer from "ol/layer/Layer";
import type Source from "ol/source/Source";
import React, { useContext, useMemo } from "react";
import Interaction from "ol/interaction/Interaction";

export type Id = string | Symbol;

export function useId(id: string | undefined): Id {
  return useMemo(() => id || Symbol(), [id]);
}

function test(map: MapInstance) {
  map.getLayerGroup()
}

export type InteractionCallback = (layers: Map<string | Symbol, Layer>, sources: Map<string | Symbol, Source>) => Interaction;

export class OpenLayersContext {
  view: View | null = null;
  map: MapInstance | null = null;
  layers: Map<Id, Layer> = new Map();
  sources: Map<Id, Source> = new Map();

  layersQ: Array<{ id: Id, layer: Layer }> = [];
  sourcesQ: Array<{ id: Id, source: Source, parent: Id }> = [];
  interactionsQ: Array<InteractionCallback> = []


  flush() {
    if(!this.map) return;
    
    var i;

    for(i = 0; i < this.layersQ.length; ++i) {
      const { id, layer } = this.layersQ[i];
      this.map.addLayer(layer);
      id && this.layers.set(id, layer);
    }


    for(i = 0; i < this.sourcesQ.length; ++i) {
      const { id, source, parent } = this.sourcesQ[i];
      const p = this.layers.get(parent);
      if(!p) {
        throw new Error("A <Source> component has been used without being wrapped in a <Layer> component")
      }
      p.setSource(source);
      this.sources.set(id, source);
    }
  }

  registerLayer(layer: Layer, id: Id) {
    this.layersQ.push({ id, layer});
  }

  disposeLayer(layer: Layer, id: Id) {
    this.map?.removeLayer(layer)
    id && this.layers.delete(id);
    layer.dispose();
  }

  registerSource(source: Source, id: Id, parent: Id) {
    this.sourcesQ.push({ source, id, parent})
  }

  disposeSource(source: Source, id: Id, parent: Id) {
    this.layers.get(parent)?.setSource(null);
    this.sources.delete(id);
    source.dispose();
  }

  registerInteraction(cb: InteractionCallback) {
    this.interactionsQ.push(cb);
  }

  disposeInteraction(interaction: Interaction) {
    this.map?.removeInteraction(interaction);
    interaction.dispose();
  }
}

export const ParentContext = React.createContext<string | Symbol | null>(null);
export const MainContext = React.createContext<OpenLayersContext | null>(null);

const msg = "Error: a react-openlayers component was used without being wrapped in a <View> component!"

export function useMainContext() {
  const lifecycle = useContext(MainContext);
  if(lifecycle === null) {
    throw new Error(msg)
  }
  return lifecycle;
}

export function useParent() {
  const parent = useContext(ParentContext);
  if(parent === null) {
    throw new Error(msg);
  }
  return parent;
}
