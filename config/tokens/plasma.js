module.exports = {
  weth: {
    parent: '0xaC12D12D5b0AF87b94c6868102d43b9c4c34a883',
    child: '0xBf1a93ab308cBe6190a804b3E0C4EF4ab3e35037',
    type: 'erc20',
    format: 'ether',
    mint: false,
  },
  erc20: {
    parent: '0x1e844a7D95A70b5C0969c5B88010502FB86b6Df8',
    child: '0x351CDacDFFCd61A660ed6Ad9831fAAcEfee7Dd3a',
    type: 'erc20',
    format: 'ether',
    mint: true,
  },
  erc721: {
    parent: '0xF0DfaD3b76C7eDA78263AD0F7B4fc6738C6f49bC',
    child: '0x6FA280b6a52Ba9f7Aa3C878a424066d597e7Bd36',
    type: 'erc721',
    format: 'ether',
    mint: false,
  },
  bone: {
    parent: '0x9DB3D91f9C3D81a29E2A8B1FFDE96Cca87Fc9655',
    child: '0x0000000000000000000000000000000000001010',
    type: 'erc20',
    format: 'ether',
    mint: false,
  },
  xfund: {
    parent: '0x245330351344F9301690D5D8De2A07f5F32e1149',
    child: '0xB7A36DfA537100CB3f1808Dd69DB3dF3C5CdF4f4',
    type: 'erc20',
    format: 'gwei',
    mint: true,
  },
  dep: {
    parent: '0xb80ACEa26024C51f9fE69023a22d6E8025c97c1A',
    child: '0x27ba679B7c85208612155C330557b1E0F4D8DC91',
    type: 'erc20',
    format: 'ether',
    mint: true,
  }
}
