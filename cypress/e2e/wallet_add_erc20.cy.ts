import { expect } from 'chai'
import { changeNetwork, accessWallet } from '../utils/utils'
import '@cypress/xpath'

const NETWORK_SWITCHER_BUTTON = '[data-cy="network-switcher"]'

describe('activity transactions', () => {
    before(() => {
        cy.visit('/')
    })

    it('has access/add erc20', async () => {
        changeNetwork(cy)
        accessWallet(cy, 'mnemonic')
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
                                    result:
                                        '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094976616e20436f696e0000000000000000000000000000000000000000000000',
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
                                    result:
                                        '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034956430000000000000000000000000000000000000000000000000000000000',
                                },
                            })
                            break
                        case '0x313ce567':
                            req.reply({
                                status: 200,
                                body: {
                                    interceptCase: 3,
                                    jsonrpc: '2.0',
                                    id: parseInt(req.body.id),
                                    result:
                                        '0x0000000000000000000000000000000000000000000000000000000000000012',
                                },
                            })
                            break
                    }
                })

                cy.get('.add_token_body > .button_secondary > .v-btn__content').click()
            })
    })
})