import { loggerService } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"
import { bugService } from "./bug.service.js"

//List
export async function getBugs(req, res) {

    try {
        let filterBy = {
            txt: req.query.txt || '',
            minSeverity: +req.query.minSeverity || 0,
            description: req.query.description || '',
            labels: req.query.labels || '',
            pageIdx: req.query.pageIdx || undefined,
            sortBy: req.query.sortBy || '',
        }
        // console.log('filterBy.. getBugs:', filterBy)
        if (filterBy.pageIdx !== undefined) filterBy.pageIdx = +filterBy.pageIdx
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`couldn't get bugs`)
    }
}


//Get
export async function getBug(req, res) {

    const { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs || []
    console.log('visitedBugs:', visitedBugs)
    try {
        if (visitedBugs.length >= 3 && !visitedBugs.includes(bugId)) {
            res.status(401).send('Wait for a bit')
            return
        }

        if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

        const bug = await bugService.getById(bugId)

        res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000/* , httpOnly: true */ });
        res.send(bug)

    } catch (err) {
        res.status(400).send(`couldn't get bug`)
        loggerService.error(err + 'in getBug')
    }
}


//Delete
export async function removeBug(req, res) {
    var { bugId } = req.params
    try {
        const response = await bugService.remove(bugId)
        res.send(response)
    } catch (err) {
        res.status(400).send(`couldn't remove bug`)
    }
}

//Save
export async function addBug(req, res) {
    const { title, severity, description } = req.body
    const bugToSave = {
        _id: null,
        title,
        description,
        severity: +severity,
        labels: [],
        createdAt: Date.now(),
        formattedCreatedAt: utilService.formatedDataForDisplay(Date.now())
        // dateTooltip: utilService.dateTooltip((Date.now(), "short")
        // dateTooltip: utilService.dateTooltip(Date.now(), "hebrew")
    }
    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`couldn't save bug`)
    }
}

//Update
export async function updateBug(req, res) {

    const { _id, title, severity, description, createdAt } = req.body
    const bugToSave = { _id, title, description, severity: +severity, createdAt: +createdAt }
    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`couldn't save bug`)
    }

}


