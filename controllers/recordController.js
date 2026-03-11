const prisma = require('../lib/prisma.js')

module.exports.createRecords = async (req, res) => {
	try {
        const userId = req.user.id

        const recordsWithAuthor = req.body.records.map(record => ({
            ...record,
            authorId: userId,
            birthDate: new Date(record.birthDate) 
        }))

        const records = await prisma.records.createManyAndReturn({
            data: recordsWithAuthor,
            skipDuplicates: true
        })

        return res.status(200).send({ 
        	message: 'Records successfully added to your history', 
        	records 
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: 'Failed to create records' })
    }
}

module.exports.getRecords = async (req, res) => {
	try {
		const records = await prisma.records.findMany()

		if(records.length === 0) {
			return res.status(400).send({ message: 'No records found' })
		}

		return res.status(200).send(records)
	} catch (err) {
		return res.status(500).send({ message: 'Error getting records' })
	}
}

module.exports.updateRecord = async (req, res) => {
	try {
        const { recordId } = req.params
        const userId = req.user.id

        const updatedRecord = await prisma.records.update({
            where: { 
                id: Number(recordId),
                authorId: userId
            },
            data: req.body,
            select: { id: true }
        })

        return res.status(200).send({ 
            message: 'Record updated successfully', 
            updatedRecord 
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: 'Failed to create record' })
    }
}

module.exports.deleteRecords = async (req, res) => {
	try {
		const userId = req.user.id
		const { ids } = req.body

		const archivedRecord = await prisma.records.deleteMany({
			where: {
				id: { in: ids.map(id => Number(id))}, 
				authorId: userId
			}
		})

		return res.status(200).send({
			message: 'Records deleted successfully',
			archiveRecord
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: 'Failed to archived record'})
	}
}