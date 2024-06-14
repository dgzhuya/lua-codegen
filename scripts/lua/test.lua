NodeJs.genApiCode('student', {
    {
        key = 'name',
        type = 'string',
        rule = NodeJs.createDtoRule(
            NodeJs.createSimpleRule('isOptional', true),
            NodeJs.createLimitRule(false, 10, "最小长度为10")
        )
    }
})
