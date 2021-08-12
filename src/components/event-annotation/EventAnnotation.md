# EventAnnotation

`EventAnnotation` component provides dropdown menus where user can select events
and display it as vertical line in the chart.

## Usage

See example below:

```html
<template>
  <EventAnnotation :annotations="annotations" @change="handleChange" />
</template>

<script>
  import EventAnnotation from '@/components/event-annotation'
  import annotations from '@/components/event-annotation/annotations'

  export default {
    name: 'MyComponent',
    components: {
      EventAnnotation,
    },
    data() {
      return {
        annotations,
      }
    },
    methods: {
      handleChange(options) {
        console.log(options)
      },
    },
  }
</script>
```

## Props

- annotations

  - Type: `Array`

  - Default: `[]`

  - Descriptions:

    Array of annotation objects. Each object can has the following property:

    - name

      Type: `String`

      Required: `true`

      Unique name identifying the annotation. It usually the event code founded in the seismic event bulletin. Example: `VTA`, `VTB`, etc.

    - label

      Type: `String`

      Required: `false`

      Label to display in the dropdown checkbox menus.

    - isEarthquakeEvent

      Type: `Boolean`

      Required: `true`

      Boolean indicating wheater annotation is earthquake event. This is used to fetch event data from BMA API.

    - checked

      Type: `Boolean`

      Required: `true`

      Boolean indicating this annotation is checked or not. Only checked events are used to fetch data from BMA API.

    - color

      Type: `String`

      Required: `false`

      Color to be used in the annotation line dropdown checkbox menus and in the chart.

    - lineStyle

      Type: `String`

      Required: `false`

      Line style type to be used in the annotation line dropdown checkbox menus and in the chart.

      Valid values are `solid`, `dashed`, and also other CSS line style or ECharts line style types.

- title

  - Type: `String`

  - Default: `Event Annotation`

  - Description:

    Title to be used in the dropdown checkbox menus and in the tooltip.

## Events

- change

  - Payloads

    - `{Array} options`

      Array of annotations options.

  - Description:

    Triggered when user has clicked Apply button in the dropdown checkbox menus.
