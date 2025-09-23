<?php

namespace App\EventListener;

use App\Entity\Task;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Bundle\SecurityBundle\Security;

class TaskListener
{
    public function __construct(
        private Security $security
    ) {}

    public function prePersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Task) {
            return;
        }

        // Si la tâche n'a pas d'utilisateur assigné, assigner l'utilisateur connecté
        if (!$entity->getUser()) {
            $user = $this->security->getUser();
            if ($user) {
                $entity->setUser($user);
            }
        }
    }
}
