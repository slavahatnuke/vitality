VAGRANTFILE_API_VERSION = "2"

name = "vitality"
memory = "512"
cpu="2"
type="" # "", "nfs"
ip = "192.168.10.101"
home = "/home/vagrant/project"
sync= "."

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  #VM
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  if type
    config.vm.synced_folder sync, home, type: type
  else
    config.vm.synced_folder sync, home
  end

  config.vm.network :private_network, ip: ip

  config.vm.provider "virtualbox" do |v|
    v.name = name
    v.customize ["modifyvm", :id, "--memory", memory]
    v.customize ["modifyvm", :id, "--cpus", cpu]
    v.customize ["modifyvm", :id, "--vram", "8"]
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  #PROVISION

  ##update
  config.vm.provision "shell", inline: "sudo apt-get -y update"

  ##curl
  config.vm.provision "shell", inline: "which curl || sudo apt-get install -y curl"

  ##node.js + vitality
  config.vm.provision "shell", inline: "which vitality || curl https://raw.githubusercontent.com/slavahatnuke/vitality/master/install/ubuntu.sh | sudo sh"

end
