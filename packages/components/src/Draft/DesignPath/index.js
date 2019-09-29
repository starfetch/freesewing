import React from 'react'

const DesignPath = props => {
  console.log('design path props', props)
  let output = []
  let i = 0
  let from = null
  for (let op of props.path.ops) {
    let key = props.part + props.name + i
    if (op.type === 'curve') {
      output.push(
        <path
          key={key + 'cp1'}
          d={`M ${from.x},${from.y} L ${op.cp1.x},${op.cp1.y}`}
          className="design path cp"
        />
      )
      i++
      output.push(
        <path
          key={key + 'cp2'}
          d={`M ${op.to.x},${op.to.y} L ${op.cp2.x},${op.cp2.y}`}
          className="design path cp"
        />
      )
      i++
      output.push(
        <circle
          key={key + 'cpcirc1'}
          cx={op.cp1.x}
          cy={op.cp1.y}
          r={3.5}
          className="design path cp"
        />
      )
      i++
      output.push(
        <circle
          key={key + 'cpcirc2'}
          cx={op.cp2.x}
          cy={op.cp2.y}
          r={3.5}
          className="design path cp"
        />
      )
      from = op.to
    } else if (op.type !== 'close') from = op.to
  }
  output.push(
    <path
      key={props.part + props.name + 'dpath'}
      d={props.path.asPathstring()}
      onClick={() =>
        props.raiseEvent('path', {
          path: props.path,
          name: props.name,
          part: props.part
        })
      }
      className="design hovertrap"
    />
  )
  return output
}

export default DesignPath
