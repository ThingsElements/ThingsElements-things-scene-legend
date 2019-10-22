import { ThingsEditorProperty } from '@things-factory/board-ui/client/modeller-module'
import { html } from 'lit-element'
import './editor-legend-status'
export class PropertyEditorLegendStatus extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-legend-status'
  }

  editorTemplate(props) {
    return html`
      <editor-legend-status
        .value=${props.value}
        fullwidth
      ></editor-legend-status>
    `
  }
}

customElements.define(PropertyEditorLegendStatus.is, PropertyEditorLegendStatus)
