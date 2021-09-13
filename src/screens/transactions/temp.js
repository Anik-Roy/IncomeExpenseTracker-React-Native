<Box
    paddingHorizontal="s"
    backgroundColor="primary"
    style={{ paddingTop: 10 }}>
    <Box
        flexDirection="row"
        justifyContent="space-between">
        <Text
            variant="title"
            style={{ fontSize: 20 }}>November</Text>
        <Chart />
    </Box>
    <Box
        flexDirection="row"
        justifyContent="space-between"
        marginTop="m">
        <Box>
            <Text
                textAlign="center"
                variant="body"
                color="white">
                Income
            </Text>
            <Text
                textAlign="center"
                fontSize={15}
                color="green"
                fontWeight="700">
                {income}
            </Text>
        </Box>
    </Box>
</Box>