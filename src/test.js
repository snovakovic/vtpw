const template = `
  <template>
    <div></div>
    <template></template>
  </template>

  <script>
  </script  >

  <style lang="scss" scoped>
  </style>

  <style>
  </style>
`




const commented = commentOutVueComponentTags(template);

console.log(commented);


function commentOutVueComponentTags(vueFileContent) {
    return vueFileContent
      // Comment out first occurenace of <template> tag allowing spaces as e.g < template >
      .replace(/(<\s*template\s*>)/, '/*$1')
      // Comment out last occurance of </template> tag allowing spaces as e.g </ template>
      .replace(/(<\s*\/\s*template\s*>)(?![\s\S]*<\s*\/\s*template\s*>)/, '$1*/')
      // Comment out first occurenace of <script **> tag allowing spaces any any text after script
      // as e.g <script lang="ts">
      .replace(/(<\s*script ?.*>)/, '/*$1')
      // Comment out first occurenace of </script> tag allowing spaces
      .replace(/(<\s*\/\s*script\s*>)/, '$1*/')
      // Comment out all occurenace of <style **> tag allowing spaces any any text after stle
      // as e.g <script lang="scss" scoped>
      .replace(/(<\s*style ?.*>)/g, '/*$1')
      // Comment out all occurenace of </style> tag allowing spaces
      .replace(/(<\s*\/\s*style\s*>)/g, '$1*/')
}

