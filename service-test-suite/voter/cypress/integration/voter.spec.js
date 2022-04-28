const { expect, assert } = require("chai")
const { it } = require("mocha")

describe('Checking Voter Webpage ', () => {

  it('Visits voter webpage', () => {

    cy.visit('http://10.102.246.211:80/')

    // Iterating over all the candidates and voting for them 
    cy.get('.cardContent').each((element,index,list)=>{

      let candidateName = element.text()

      if(candidateName){

        cy.visit('http://10.102.246.211:80/') // Ingress Endpoint

        cy.intercept(
        {
          method: 'POST', 
          url: '*ballot*', 
        }
        ).as('postresult')

        cy.contains(candidateName).click()
        
        cy.get('.selectedCard')
        .should('be.visible')

        cy.wait('@postresult',{ responseTimeout: 5000 }).then((interception) => {
          assert.isNotNull(interception.response.body, '{code: 201, message: "Vote saved sucessfully"}')
        })

        cy.contains('Show Results')
        .click()
  
        cy.url()
        .should('be.equal','http://10.102.246.211:80/voter/result')

        cy.contains(candidateName)
        cy.reload()

      }
      else {
        cy.log("Add candidates first !")
      }

    })
    
  })

})
