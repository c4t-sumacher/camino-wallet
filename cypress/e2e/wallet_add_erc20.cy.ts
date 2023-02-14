import { expect } from 'chai'
import { changeNetwork, accessWallet } from '../utils/utils'
import '@cypress/xpath'

const NETWORK_SWITCHER_BUTTON = '[data-cy="network-switcher"]'
const hexName ="0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094976616e20436f696e0000000000000000000000000000000000000000000000";
const hexSymbol= "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034956430000000000000000000000000000000000000000000000000000000000";
const hexDecimals= "0x0000000000000000000000000000000000000000000000000000000000000012";
const name =hex2a(hexName)
const symbol=hex2a(hexSymbol)

describe('activity transactions', () => {
    before(() => {
        cy.visit('/')
    })
    let address = [
        "prison",
        "assist",
        "dress",
        "stay",
        "target",
        "same",
        "brown",
        "rally",
        "remove",
        "spice",
        "abstract",
        "liberty",
        "valley",
        "program",
        "wealth",
        "vacuum",
        "claw",
        "cat",
        "april",
        "relief",
        "choice",
        "voyage",
        "toddler",
        "forum"
    ];
    it('has access/add erc20', async () => {
        changeNetwork(cy)
        accessWallet(cy, 'mnemonic', address)
        cy.get('.scrollable > :nth-child(1) > .add_token_row > :nth-child(1)').should('be.visible')
        cy.get('.scrollable > :nth-child(1) > .add_token_row > :nth-child(1)').click()
        cy.get('.add_token_body > :nth-child(1) > input', { timeout: 5000 }).should('be.visible')
        cy.get('.add_token_body > :nth-child(1) > input')
            .type('0xB63207E94F180c095793711BeEfb31352e129160')
            .then(() => {
                let strUrlRpc: any = localStorage.getItem('network_selected')
                let strUrlRpcArr = strUrlRpc.split('"')

                cy.intercept({ method: 'POST', url: `${strUrlRpcArr[1]}/ext/bc/C/rpc` }, (req) => {

                    switch (req.body.params[0].data) {
                        case '0x06fdde03':
                            req.reply({
                                status: 200,
                                body: {
                                    interceptCase: 1,
                                    jsonrpc: '2.0',
                                    id: parseInt(req.body.id),
                                    result: hexName
                                },
                            })
                            break
                        case '0x95d89b41':
                            req.reply({
                                status: 200,
                                body: {
                                    interceptCase: 2,
                                    jsonrpc: '2.0',
                                    id: parseInt(req.body.id),
                                    result:hexSymbol                                },
                            })
                            break
                        case '0x313ce567':
                            req.reply({
                                status: 200,
                                body: {
                                    interceptCase: 3,
                                    jsonrpc: '2.0',
                                    id: parseInt(req.body.id),
                                    result: hexDecimals
                                },
                            })
                            break
                    }
                })

                cy.get('.add_token_body > .button_secondary > .v-btn__content').click()
            })
            cy.get('.erc_row').should('be.visible');
    });

    after(async () => {
        let nameERC20 = await getName();
        let symbolERC20 = await getSymbol();
        if(name == nameERC20 && symbol == symbolERC20)
        {
            cy.log("Success");
        }
        else
        {
            cy.log("Failed");
        }
    })
});


function getName () 
{
    return new Promise((resolve,reject) => {
        cy.get('[data-cy="token-erc20-name"]').invoke("text").then(text => {
            resolve(text);
        });
    })
}

function getSymbol () 
{
    return new Promise((resolve,reject) => {
        cy.get('[data-cy="token-erc20-symbol"]').invoke("text").then(text => {
            resolve(text);
        });
    })
}

function hex2a(hex) {
    var hex = hex.toString();
    var str = "";
    for (var i = 0; i < hex.length; i += 2){
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
  let strSplitted = str.split('').filter((str) => str != '\u0000' && str != '\t');
  let strTemp = "";
  for(let i = 0; i < strSplitted.length; i++)
  {
  	strTemp = strTemp + strSplitted[i];
  }
  let strTempSplitted = strTemp.split(" ");
  let strFinal = strTempSplitted[1] + " " + strTempSplitted[2];
  console.log("string de :",strFinal);
  return strFinal
}