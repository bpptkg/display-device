/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as zrUtil from 'zrender/src/core/util'
import VisualMapView from 'echarts/lib/component/visualMap/VisualMapView'
import * as graphic from 'echarts/lib/util/graphic'
import { createSymbol } from './symbol'
import * as layout from 'echarts/lib/util/layout'
import * as helper from 'echarts/lib/component/visualMap/helper'

var CustomPiecewiseVisualMapView = VisualMapView.extend({
  type: 'visualMap.customPiecewise',

  /**
   * @protected
   * @override
   */
  doRender: function () {
    var thisGroup = this.group

    thisGroup.removeAll()

    var visualMapModel = this.visualMapModel
    var textGap = visualMapModel.get('textGap')
    var textStyleModel = visualMapModel.textStyleModel
    var textFont = textStyleModel.getFont()
    var textFill = textStyleModel.getTextColor()
    var itemAlign = this._getItemAlign()
    var itemSize = visualMapModel.itemSize
    var viewData = this._getViewData()
    var endsText = viewData.endsText
    var showLabel = zrUtil.retrieve(
      visualMapModel.get('showLabel', true),
      !endsText
    )

    endsText &&
      this._renderEndsText(
        thisGroup,
        endsText[0],
        itemSize,
        showLabel,
        itemAlign
      )

    const maxItemSize = Math.max(
      ...viewData.viewPieceList.map((v) => {
        const item = v.piece
        const itemWidth = item.extendedProps
          ? item.extendedProps.itemWidth
            ? item.extendedProps.itemWidth
            : itemSize[0]
          : itemSize[0]
        const itemHeight = item.extendedProps
          ? item.extendedProps.itemHeight
            ? item.extendedProps.itemHeight
            : itemSize[1]
          : itemSize[1]
        return Math.max(itemWidth, itemHeight)
      })
    )

    zrUtil.each(viewData.viewPieceList, renderItem, this)

    endsText &&
      this._renderEndsText(
        thisGroup,
        endsText[1],
        itemSize,
        showLabel,
        itemAlign
      )

    layout.box(
      visualMapModel.get('orient'),
      thisGroup,
      visualMapModel.get('itemGap')
    )

    this.renderBackground(thisGroup)

    this.positionGroup(thisGroup)

    function renderItem(item) {
      var piece = item.piece

      var itemGroup = new graphic.Group()
      itemGroup.onclick = zrUtil.bind(this._onItemClick, this, piece)

      this._enableHoverLink(itemGroup, item.indexInModelPieceList)

      var representValue = visualMapModel.getRepresentValue(piece)
      var { extendedProps = {} } = piece
      var offsetX = (maxItemSize - (extendedProps.itemWidth || itemSize[0])) / 2

      this._createItemSymbol(
        itemGroup,
        representValue,
        [
          extendedProps.itemSymbol && extendedProps.itemSymbol === 'circle'
            ? offsetX
            : 0,
          0,
          extendedProps.itemWidth || itemSize[0],
          extendedProps.itemHeight || itemSize[1],
        ],
        extendedProps.itemSymbol,
        extendedProps.itemColor,
        extendedProps.itemKeepAspect,
        extendedProps.itemInnerColor,
        extendedProps.itemOutlineColor,
        extendedProps.itemLineWidth
      )

      if (showLabel) {
        var visualState = this.visualMapModel.getValueState(representValue)

        itemGroup.add(
          new graphic.Text({
            style: {
              x: itemAlign === 'right' ? -textGap : itemSize[0] + textGap,
              y: (extendedProps.itemHeight || itemSize[1]) / 2,
              text: piece.text,
              textVerticalAlign: 'middle',
              textAlign: itemAlign,
              textFont: textFont,
              textFill: textFill,
              opacity: visualState === 'outOfRange' ? 0.5 : 1,
            },
          })
        )
      }

      thisGroup.add(itemGroup)
    }
  },

  /**
   * @private
   */
  _enableHoverLink: function (itemGroup, pieceIndex) {
    itemGroup
      .on('mouseover', zrUtil.bind(onHoverLink, this, 'highlight'))
      .on('mouseout', zrUtil.bind(onHoverLink, this, 'downplay'))

    function onHoverLink(method) {
      var visualMapModel = this.visualMapModel

      visualMapModel.option.hoverLink &&
        this.api.dispatchAction({
          type: method,
          batch: helper.makeHighDownBatch(
            visualMapModel.findTargetDataIndices(pieceIndex),
            visualMapModel
          ),
        })
    }
  },

  /**
   * @private
   */
  _getItemAlign: function () {
    var visualMapModel = this.visualMapModel
    var modelOption = visualMapModel.option

    if (modelOption.orient === 'vertical') {
      return helper.getItemAlign(
        visualMapModel,
        this.api,
        visualMapModel.itemSize
      )
    } else {
      // horizontal, most case left unless specifying right.
      var align = modelOption.align
      if (!align || align === 'auto') {
        align = 'left'
      }
      return align
    }
  },

  /**
   * @private
   */
  _renderEndsText: function (group, text, itemSize, showLabel, itemAlign) {
    if (!text) {
      return
    }

    var itemGroup = new graphic.Group()
    var textStyleModel = this.visualMapModel.textStyleModel

    itemGroup.add(
      new graphic.Text({
        style: {
          x: showLabel
            ? itemAlign === 'right'
              ? itemSize[0]
              : 0
            : itemSize[0] / 2,
          y: itemSize[1] / 2,
          textVerticalAlign: 'middle',
          textAlign: showLabel ? itemAlign : 'center',
          text: text,
          textFont: textStyleModel.getFont(),
          textFill: textStyleModel.getTextColor(),
        },
      })
    )

    group.add(itemGroup)
  },

  /**
   * @private
   * @return {Object} {peiceList, endsText} The order is the same as screen pixel order.
   */
  _getViewData: function () {
    var visualMapModel = this.visualMapModel

    var viewPieceList = zrUtil.map(
      visualMapModel.getPieceList(),
      function (piece, index) {
        return { piece: piece, indexInModelPieceList: index }
      }
    )
    var endsText = visualMapModel.get('text')

    // Consider orient and inverse.
    var orient = visualMapModel.get('orient')
    var inverse = visualMapModel.get('inverse')

    // Order of model pieceList is always [low, ..., high]
    if (orient === 'horizontal' ? inverse : !inverse) {
      viewPieceList.reverse()
    }
    // Origin order of endsText is [high, low]
    else if (endsText) {
      endsText = endsText.slice().reverse()
    }

    return { viewPieceList: viewPieceList, endsText: endsText }
  },

  /**
   * @private
   */
  _createItemSymbol: function (
    group,
    representValue,
    shapeParam,
    symbol,
    color,
    keepAspect,
    innerColor,
    outlineColor,
    lineWidth
  ) {
    group.add(
      createSymbol(
        symbol || this.getControllerVisual(representValue, 'symbol'),
        shapeParam[0],
        shapeParam[1],
        shapeParam[2],
        shapeParam[3],
        color || this.getControllerVisual(representValue, 'color'),
        keepAspect || true,
        innerColor || this.getControllerVisual(representValue, 'color'),
        outlineColor || this.getControllerVisual(representValue, 'color'),
        lineWidth
      )
    )
  },

  /**
   * @private
   */
  _onItemClick: function (piece) {
    var visualMapModel = this.visualMapModel
    var option = visualMapModel.option
    var selected = zrUtil.clone(option.selected)
    var newKey = visualMapModel.getSelectedMapKey(piece)

    if (option.selectedMode === 'single') {
      selected[newKey] = true
      zrUtil.each(selected, function (o, key) {
        selected[key] = key === newKey
      })
    } else {
      selected[newKey] = !selected[newKey]
    }

    this.api.dispatchAction({
      type: 'selectDataRange',
      from: this.uid,
      visualMapId: this.visualMapModel.id,
      selected: selected,
    })
  },
})

export default CustomPiecewiseVisualMapView
