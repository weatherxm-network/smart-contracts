import { ethers, } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe('AlphaDeal', () => {
  async function deployInitialStateFixture() {
    const [
      deployer,
      distributor,
      user1
    ] = await ethers.getSigners();
    const AlphaDeal = await ethers.getContractFactory('AlphaDeal');
    const alphaDeal = await AlphaDeal.deploy('AlphaDeal', 'AD', 1500);

    return {
      alphaDeal,
      deployer,
      distributor,
      user1
    };
  }

  describe('constructor', () => {
    it('should mint 1500 tokens to the owner upon deployment', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      const totalSupply = await alphaDeal.totalSupply()
      const ownerBalance = await alphaDeal.balanceOf(deployer.address)

      expect(totalSupply).to.equal(1500)
      expect(ownerBalance).to.equal(1500)
    });

    it('should set the name and symbol correctly', async () => {
      const { alphaDeal } = await loadFixture(deployInitialStateFixture);
      
      const name = await alphaDeal.name()
      const symbol = await alphaDeal.symbol()

      expect(name).to.equal('AlphaDeal')
      expect(symbol).to.equal('AD')
    });

    it('should set the deployer as owner', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      const realOwner = await alphaDeal.owner()

      expect(realOwner).to.equal(deployer.address)
    });
  });

  describe('setBaseURI', () => {
    it('should set the correct baseURI', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      const expectedURI1 = 'URI1'
      await alphaDeal.connect(deployer).setBaseURI(expectedURI1)
      const readURI1 = await alphaDeal.baseURI()

      expect(readURI1).to.equal(expectedURI1)

      const expectedURI2 = 'URI2'
      await alphaDeal.connect(deployer).setBaseURI(expectedURI2)
      const readURI2 = await alphaDeal.baseURI()

      expect(readURI2).to.equal(expectedURI2)
    });

    it('should emit BatchMetadataUpdate event', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      await expect(
        await alphaDeal.connect(deployer).setBaseURI('URI1')
      ).to.emit(alphaDeal, 'BatchMetadataUpdate')
      .withArgs(0, ethers.constants.MaxUint256)
      
    });

    it('should revert if not called by the owner', async () => {
      const { alphaDeal, user1 } = await loadFixture(deployInitialStateFixture);

      await expect(
        alphaDeal.connect(user1).setBaseURI('URI1')
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('should revert if the metadata are frozen', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);

      await alphaDeal.connect(deployer).freezeMetadata();

      await expect(
        alphaDeal.connect(deployer).setBaseURI('URI1')
      ).to.be.revertedWithCustomError(alphaDeal, 'MetadataFrozen')
    })
  });

  describe('setContractURI', () => {
    it('should set the correct contractURI', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      const expectedURI1 = 'URI1'
      await alphaDeal.connect(deployer).setContractURI(expectedURI1)
      const readURI1 = await alphaDeal.contractURI()

      expect(readURI1).to.equal(expectedURI1)

      const expectedURI2 = 'URI2'
      await alphaDeal.connect(deployer).setContractURI(expectedURI2)
      const readURI2 = await alphaDeal.contractURI()

      expect(readURI2).to.equal(expectedURI2)
    });

    it('should emit ContractURIUpdated event', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      await expect(
        await alphaDeal.connect(deployer).setContractURI('URI1')
      ).to.emit(alphaDeal, 'ContractURIUpdated')
      
    });

    it('should revert if not called by the owner', async () => {
      const { alphaDeal, user1 } = await loadFixture(deployInitialStateFixture);

      await expect(
        alphaDeal.connect(user1).setContractURI('URI1')
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('should revert if the metadata are frozen', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);

      await alphaDeal.connect(deployer).freezeMetadata();

      await expect(
        alphaDeal.connect(deployer).setContractURI('URI1')
      ).to.be.revertedWithCustomError(alphaDeal, 'MetadataFrozen')
    })
  });

  describe('freezeMetadata', () => {
    it('should set isMetadataFrozen to true', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      await alphaDeal.connect(deployer).freezeMetadata()
      const isMetadataFrozen = await alphaDeal.isMetadataFrozen()

      expect(isMetadataFrozen).to.equal(true)
    });

    it('should revert if not called by the owner', async () => {
      const { alphaDeal, user1 } = await loadFixture(deployInitialStateFixture);

      await expect(
        alphaDeal.connect(user1).freezeMetadata()
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('should emit MetadataFreeze event', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);
      
      await expect(
        await alphaDeal.connect(deployer).freezeMetadata()
      ).to.emit(alphaDeal, 'MetadataFreeze')
    });
  });

  describe('tokenURI', () => {
    it('should return the baseURI for all tokens', async () => {
      const { alphaDeal, deployer } = await loadFixture(deployInitialStateFixture);

      await alphaDeal.connect(deployer).setBaseURI('ipfs://path/')

      for(let i = 0 ; i < 1500 ; i++) {
        const uri = await alphaDeal.tokenURI(i)

        expect(uri).to.equal(`ipfs://path/${i}`)
      }
    })
  })

  // describe.only('full flow', () => {
  //   it('mint 1500 NFTs and transfer to the distributor', async () => {
  //     const { alphaDeal, deployer, distributor } = await loadFixture(deployInitialStateFixture);

  //     for(let i = 0 ; i < 100 ; i++) {
  //       await alphaDeal.connect(deployer)['safeTransferFrom(address,address,uint256)'](deployer.address, distributor.address, i)
  //     }
  //   })
  // })
})
