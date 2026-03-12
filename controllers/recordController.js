const prisma = require('../lib/prisma.js')

module.exports.createRecords = async (req, res) => {
	try {
        const userId = req.user.id

        const recordsWithAuthor = req.body.records.map(record => {
        	const { id, authorId, createdAt, ...safeBody } = record
            return {
            	...record,
            	authorId: userId,
            	birthDate: new Date(record.birthDate) 
            }
        })

        const records = await prisma.records.createManyAndReturn({
            data: recordsWithAuthor,
            skipDuplicates: true
        })

        if(records.length === 0) {
        	return res.status(400).send({
        		message: 'No new records added. These residents are already recorded in the database',
        		records: []
        	})
        }

        return res.status(200).send({ 
        	message: 'Records successfully added to your dashboard and history', 
        	records 
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: 'Failed to create records' })
    }
}

module.exports.getRecords = async (req, res) => {
	try {
		const userId = req.user.id

		const records = await prisma.records.findMany({
			where: {
				authorId: userId,
				NOT: { status: "DELETED" }
			},
			orderBy: {
				updatedAt: 'desc'
			}
		})

		if(records.length === 0) {
			return res.status(400).send({ error: 'No records found' })
		}

		return res.status(200).send(records)
	} catch (err) {
		return res.status(500).send({ error: 'Error getting records' })
	}
}

module.exports.updateRecord = async (req, res) => {
	try {
		const { id, authorId, createdAt, ...safeBody } = req.body
        const { recordId } = req.params
        const userId = req.user.id

        const updatedRecord = {
        	...req.body,
        	birthDate: new Date(req.body.birthDate)
        }

        const currentRecord = await prisma.records.findUnique({
            where: { id: Number(recordId) }
        })

        if (!currentRecord || currentRecord.authorId !== userId) {
            return res.status(404).send({ error: "Record not found" });
        }

        const isDifferent = Object.keys(updatedRecord).some(
            key => updatedRecord[key].toString() !== currentRecord[key].toString()
        );

        if(!isDifferent) {
            return res.status(200).send({ 
                message: 'No changes detected', 
                updatedRecord: { id: currentRecord.id } 
            });
        } else {
        	const updatedRecord = await prisma.records.update({
        	    where: { 
        	        id: Number(recordId),
        	        authorId: userId
        	    },
        	    data: {
        	    	...safeBody,
        	    	birthDate: new Date(req.body.birthDate),
        	    	status: "UPDATED"
        	    },
        	    select: { id: true }
        	})

        	return res.status(200).send({ 
        	    message: 'Record updated successfully', 
        	    updatedRecord 
        	})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: 'Failed to update record' })
    }
}

module.exports.deleteRecords = async (req, res) => {
	try {
		const userId = req.user.id
		const { ids } = req.body

		const archivedRecord = await prisma.records.updateMany({
			where: {
				id: { in: ids.map(id => Number(id))}, 
				authorId: userId
			},
			data: { status: "DELETED" }
		})

		return res.status(200).send({
			message: 'Records deleted successfully',
			archivedRecord
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: 'Failed to delete record'})
	}
}