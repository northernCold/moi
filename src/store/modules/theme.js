export default {
  namespaced: true,
  state: () => ({
    collapsedSections: [],
  }),
  mutation: {
    setCollapsedSection({ theme }, value) {
      theme.collapsedSections.includes(value)
        ? (theme.collapsedSections = theme.collapsedSections.filter((section) => section !== value))
        : theme.collapsedSections.push(value)
    },
  }
}