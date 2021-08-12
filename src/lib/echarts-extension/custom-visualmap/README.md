# VisualMap customPiecewise

This directory contains visual map extension module called `customPiecewise`. We
write this module based on ECharts visual map piecewise code that enables us to
customize graphical items in the visual map legend.

Customizing graphical item can be done by providing `extendedProps` in each
`pieces` entry. For example:

```js
pieces: [
  {
    min: 0,
    max: 1,
    symbolSize: 5,
    extendedProps: {
      itemWidth: 5,
      itemHeight: 5,
      itemSymbol: 'circle',
      itemColor: 'blue',
    },
  },
  {
    min: 1,
    max: 2,
    symbolSize: 10,
    extendedProps: {
      itemWidth: 10,
      itemHeight: 10,
      itemSymbol: 'circle',
      itemColor: 'blue',
    },
  },
  {
    min: 3,
    max: 4,
    symbolSize: 15,
    extendedProps: {
      itemWidth: 15,
      itemHeight: 15,
      itemSymbol: 'circle',
      itemColor: 'blue',
    },
  },
  {
    min: 4,
    symbolSize: 20,
    extendedProps: {
      itemWidth: 20,
      itemHeight: 20,
      itemSymbol: 'circle',
      itemColor: 'blue',
    },
  },
]
```

Available properties are:

- itemSymbol (String)

  Item symbol kind. For example `rect`, `circle`, or any valid ECharts symbol
  kinds.

- itemWidth (Number)

  Width of graphical item in pixel.

- itemHeight (Number)

  Height of graphical item in pixel.

- itemColor (String)

  Color of graphical item. For example, red, blue, of hexadecimal color. For
  transparent color, you can set itemColor to `none`.

- itemOutlineColor (String)

  Outline color of graphical item. For example, green, red or hexadecimal color.

- itemLineWidth (Number)

  Outline line width of graphical item in pixel.
