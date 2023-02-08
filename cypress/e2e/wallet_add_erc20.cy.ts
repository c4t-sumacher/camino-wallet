import { expect } from 'chai'
import { changeNetwork, accessWallet } from '../utils/utils'

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

                cy.request({
                    method: "POST",
                    url: "**/ext/bc/C/rpc",
                    body: {
                        "jsonrpc": "2.0",
                        "id": 15,
                        "method": "eth_call",
                        "params": [
                          {
                            "data": "0x06fdde03",
                            "to": "0xe5be373a1452543d67d7d22935d4e4b46e4aad30"
                          },
                          "latest"
                        ]
                      }
                });

                cy.intercept({ method: 'POST', url: '**/ext/bc/C/rpc', times: 1 }, (req) => {
                    req.reply({
                        status: 200,
                        body: {
                            jsonrpc: '2.0',
                            id: 15,
                            result:
                                '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094976616e20436f696e0000000000000000000000000000000000000000000000',
                        },
                    })
                });

                cy.request({
                    method: "POST",
                    url: "**/ext/bc/C/rpc",
                    body: {
                        "jsonrpc": "2.0",
                        "id": 16,
                        "method": "eth_call",
                        "params": [
                          {
                            "data": "0x95d89b41",
                            "to": "0xe5be373a1452543d67d7d22935d4e4b46e4aad30"
                          },
                          "latest"
                        ]
                      }
                });

                // cy.intercept({ method: 'POST', url: '**/ext/bc/C/rpc', times: 1 }, (req) => {
                //     req.reply({
                //         status: 200,
                //         body: {
                //             jsonrpc: '2.0',
                //             id: 16,
                //             result:
                //                 '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034956430000000000000000000000000000000000000000000000000000000000',
                //         },
                //     })
                // });

                // cy.request({
                //     method: "POST",
                //     url: "**/ext/bc/C/rpc",
                //     body: {
                //         "jsonrpc": "2.0",
                //         "id": 17,
                //         "method": "eth_call",
                //         "params": [
                //           {
                //             "data": "0x313ce567",
                //             "to": "0xe5be373a1452543d67d7d22935d4e4b46e4aad30"
                //           },
                //           "latest"
                //         ]
                //       }
                // });

                // cy.intercept({ method: 'POST', url: '**/ext/bc/C/rpc', times: 1 }, (req) => {
                //     req.reply({
                //         status: 200,
                //         body: {
                //             jsonrpc: '2.0',
                //             id: 17,
                //             result:
                //                 '0x0000000000000000000000000000000000000000000000000000000000000012',
                //         },
                //     });
                // });

                cy.get('.add_token_body > .button_secondary > .v-btn__content').click()
            })
    })
})
