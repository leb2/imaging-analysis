import nipype.interfaces.spm as spm         # the spm interfaces
import nipype.pipeline.engine as pe         # the workflow and node wrappers
import sys

realigner = pe.Node(interface=spm.Realign(), name='realign')
# realigner.inputs.in_files = '/Users/Brendan/projects/utra-test/nipype/data/sub-01/func/sub1-functional.nii'
realigner.inputs.in_files = sys.argv[1]
realigner.inputs.register_to_mean = True

smoother = pe.Node(interface=spm.Smooth(fwhm=6), name='smooth')

workflow = pe.Workflow(name='preproc')
workflow.base_dir = '.'

workflow.add_nodes([smoother, realigner])
workflow.connect(realigner, 'realigned_files', smoother, 'in_files')

workflow.run()
