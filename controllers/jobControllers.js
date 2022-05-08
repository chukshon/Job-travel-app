import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { badRequestError, notFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'

const createJob = async (req, res) => {
  const { position, company } = req.body

  if (!position || !company) {
    throw new badRequestError('Please Provide All Values')
  }

  req.body.createdBy = req.user.userId

  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId })
  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}

const deleteJob = (req, res) => {
  res.send('Delete Job')
}
const updateJob = async (req, res) => {
  const { id: jobId } = req.params

  const { company, position } = req.body

  if (!company || !position) {
    throw new badRequestError('Please Provide All Values')
  }

  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new notFoundError(`No job with id ${jobId}`)
  }

  // check permissions
  checkPermissions(req.user, job.createdBy)

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ updatedJob })
}

const showStats = (req, res) => {
  res.send('Show Stats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }
