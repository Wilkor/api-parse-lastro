class MessageDTO {
    constructor({ type, content, id, from, metadata, contactName, token, contract, phoneNumber }) {
        this.type = type;
        this.content = content;
        this.id = id;
        this.from = from;
        this.metadata = metadata;
        this.contactName = contactName;
        this.token = token
        this.contract = contract
        this.display_phone_number = phoneNumber
    }

    toResponseFormat() {
        return {
            object: "whatsapp_business_account",
            entry: [
                {
                    id: "111111111111111111111111",
                    changes: [
                        {
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: this.display_phone_number,
                                    phone_number_id: "PHONE_NUMBER_ID"
                                },
                                contacts: [
                                    {
                                        profile: {
                                            name: this.contactName
                                        },
                                        wa_id: this.metadata['#tunnel.originator']
                                    }
                                ],
                                messages: [
                                    {
                                        from: this.metadata['#tunnel.originator'],
                                        id: this.id,
                                        content: this.content,
                                        type: this.type,
                                        token: this.token,
                                        contract: this.contract
                                    }
                                ]
                            },
                            field: "messages"
                        }
                    ]
                }
            ]
        };
    }
}

module.exports = MessageDTO;
