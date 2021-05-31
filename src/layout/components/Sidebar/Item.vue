<script>
import ICON from '@/assets/logout.png'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    // if (icon) {
    // vnodes.push(<svg-icon icon-class="test"/>)
    // vnodes.push(h('img', {
    //   class: 'svg-icon',
    //   style: {
    //     width: '14px',
    //     height: '14px',
    //     verticalAlign: 'middle'
    //     // marginRight: '16px',
    //     // marginLeft: '20px'
    //   },
    //   attrs: {
    //     src: require('@/assets/logout.png')
    //   }
    // }))
    // }

    vnodes.push(<svg-icon icon-class={icon}/>)
    vnodes.push(<span slot="title">{(title)}</span>)
    return vnodes
  }
}
</script>
